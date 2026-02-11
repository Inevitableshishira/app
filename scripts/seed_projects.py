#!/usr/bin/env python3
"""Seed initial projects into the database"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / 'backend'))

async def seed_projects():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'test_database')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Check if projects already exist
    existing_count = await db.projects.count_documents({})
    if existing_count > 0:
        print(f"Database already has {existing_count} projects. Skipping seed.")
        client.close()
        return
    
    projects = [
        {
            'id': '1',
            'title': 'The Solace Penthouse',
            'category': 'Residential',
            'image': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200',
            'year': '2023',
            'location': 'Geneva, Switzerland',
            'description': 'A sanctuary of light and glass designed for tranquil urban living.',
            'created_at': datetime.now(timezone.utc).isoformat()
        },
        {
            'id': '2',
            'title': 'Velocity Headquarters',
            'category': 'Commercial',
            'image': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200',
            'year': '2022',
            'location': 'Austin, USA',
            'description': 'A dynamic office ecosystem fostering collaboration and deep work.',
            'created_at': datetime.now(timezone.utc).isoformat()
        },
        {
            'id': '3',
            'title': 'Kinetic Hybrid Loft',
            'category': 'Urban',
            'image': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200',
            'year': '2024',
            'location': 'Berlin, Germany',
            'description': 'A seamless integration of living quarters and a professional creative studio.',
            'created_at': datetime.now(timezone.utc).isoformat()
        },
        {
            'id': '4',
            'title': 'Lumina Corporate Park',
            'category': 'Commercial',
            'image': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1200',
            'year': '2023',
            'location': 'London, UK',
            'description': 'Redefining the modern campus with biophilic architecture.',
            'created_at': datetime.now(timezone.utc).isoformat()
        }
    ]
    
    result = await db.projects.insert_many(projects)
    print(f"✓ Seeded {len(result.inserted_ids)} projects into database")
    
    client.close()

if __name__ == '__main__':
    asyncio.run(seed_projects())
