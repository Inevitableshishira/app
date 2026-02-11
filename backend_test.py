#!/usr/bin/env python3
import requests
import json
import sys
import time
from datetime import datetime

class ApexForgeAPITester:
    def __init__(self, base_url="https://design-to-launch.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_credentials = {"username": "admin", "password": "admin123"}

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   → {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"   ✅ PASS - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"   ❌ FAIL - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   → Error: {error_detail}")
                except:
                    print(f"   → Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            print(f"   ❌ ERROR - {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test API health endpoint"""
        return self.run_test("API Health Check", "GET", "", 200)

    def test_admin_login(self):
        """Test admin authentication"""
        success, response = self.run_test(
            "Admin Login",
            "POST", 
            "admin/login",
            200,
            data=self.admin_credentials
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   → Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_get_projects(self):
        """Test getting all projects (public endpoint)"""
        success, response = self.run_test("Get Projects", "GET", "projects", 200)
        if success:
            print(f"   → Found {len(response)} projects")
            if len(response) > 0:
                # Check first project structure
                project = response[0]
                required_fields = ['id', 'title', 'category', 'image', 'year', 'location', 'description']
                missing_fields = [field for field in required_fields if field not in project]
                if missing_fields:
                    print(f"   ⚠️  Missing project fields: {missing_fields}")
                else:
                    print(f"   → Project structure valid")
        return success, response if success else []

    def test_contact_form(self):
        """Test contact form submission"""
        test_inquiry = {
            "name": "Test User",
            "email": "test@example.com", 
            "message": "This is a test inquiry from the automated testing suite."
        }
        success, response = self.run_test("Contact Form Submission", "POST", "contact", 200, data=test_inquiry)
        if success:
            print(f"   → Inquiry created with ID: {response.get('id', 'N/A')}")
        return success, response if success else {}

    def test_create_project(self):
        """Test creating a new project (admin only)"""
        if not self.token:
            print("   ⚠️  No admin token - skipping test")
            return False, {}
            
        test_project = {
            "title": "Test Project",
            "category": "Residential", 
            "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
            "year": "2024",
            "location": "Test City",
            "description": "A test project created by the automated testing suite."
        }
        success, response = self.run_test("Create Project", "POST", "admin/projects", 200, data=test_project)
        if success:
            print(f"   → Project created with ID: {response.get('id', 'N/A')}")
        return success, response if success else {}

    def test_update_project(self, project_id):
        """Test updating an existing project"""
        if not self.token:
            print("   ⚠️  No admin token - skipping test")
            return False
            
        update_data = {
            "title": "Updated Test Project",
            "description": "This project was updated by the automated testing suite."
        }
        success, response = self.run_test("Update Project", "PUT", f"admin/projects/{project_id}", 200, data=update_data)
        if success:
            print(f"   → Project updated: {response.get('title', 'N/A')}")
        return success

    def test_delete_project(self, project_id):
        """Test deleting a project"""
        if not self.token:
            print("   ⚠️  No admin token - skipping test")
            return False
            
        success, _ = self.run_test("Delete Project", "DELETE", f"admin/projects/{project_id}", 200)
        return success

    def test_get_inquiries(self):
        """Test getting all inquiries (admin only)"""
        if not self.token:
            print("   ⚠️  No admin token - skipping test")
            return False, []
            
        success, response = self.run_test("Get Inquiries", "GET", "admin/inquiries", 200)
        if success:
            print(f"   → Found {len(response)} inquiries")
        return success, response if success else []

    def test_delete_inquiry(self, inquiry_id):
        """Test deleting an inquiry"""
        if not self.token:
            print("   ⚠️  No admin token - skipping test")
            return False
            
        success, _ = self.run_test("Delete Inquiry", "DELETE", f"admin/inquiries/{inquiry_id}", 200)
        return success

    def run_all_tests(self):
        """Run comprehensive API test suite"""
        print("🚀 Starting ApexForge Studio API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print("="*60)

        # Health check
        self.test_health_check()

        # Public endpoints
        projects_success, projects = self.test_get_projects()
        contact_success, inquiry = self.test_contact_form()

        # Admin authentication
        login_success = self.test_admin_login()

        created_project_id = None
        created_inquiry_id = inquiry.get('id') if contact_success else None

        if login_success:
            # Admin project operations
            create_success, new_project = self.test_create_project()
            if create_success:
                created_project_id = new_project.get('id')
                
                # Test update and delete with the created project
                if created_project_id:
                    self.test_update_project(created_project_id)
                    # Wait a moment before deletion
                    time.sleep(0.5)
                    self.test_delete_project(created_project_id)

            # Admin inquiry operations  
            inquiries_success, inquiries = self.test_get_inquiries()
            
            # Clean up test inquiry if it was created
            if created_inquiry_id and inquiries:
                test_inquiry = next((inq for inq in inquiries if inq.get('id') == created_inquiry_id), None)
                if test_inquiry:
                    self.test_delete_inquiry(created_inquiry_id)

        # Print final results
        print("\n" + "="*60)
        print(f"📊 FINAL RESULTS")
        print(f"   Tests Passed: {self.tests_passed}/{self.tests_run}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%" if self.tests_run > 0 else "   No tests run")
        
        if self.tests_passed == self.tests_run:
            print("   🎉 ALL TESTS PASSED!")
            return 0
        else:
            failed_count = self.tests_run - self.tests_passed
            print(f"   ⚠️  {failed_count} TESTS FAILED")
            return 1

if __name__ == "__main__":
    tester = ApexForgeAPITester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)