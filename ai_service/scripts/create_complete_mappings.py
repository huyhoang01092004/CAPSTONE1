"""
CREATE COMPREHENSIVE SYMPTOM-DEPARTMENT MAPPINGS
Based on ACTUAL symptom names in clinic_management database

Departments:
1. Cardiology (ID=1)
2. Neurology (ID=2)
3. Internal Medicine (ID=3)
4. ENT (ID=4)
5. Pediatrics (ID=5)
6. Orthopedics (ID=6)
"""

import mysql.connector
import sys
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Connect to database
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='root',
    database='clinic_management',
    charset='utf8mb4',
    use_unicode=True
)

cursor = conn.cursor(dictionary=True)

print("=" * 70)
print("CREATING COMPREHENSIVE SYMPTOM-DEPARTMENT MAPPINGS")
print("=" * 70)

# Get all symptoms
cursor.execute("SELECT symptom_id, name FROM symptoms")
all_symptoms = {row['name']: row['symptom_id'] for row in cursor.fetchall()}
print(f"\nTotal symptoms in database: {len(all_symptoms)}")

# Department IDs
DEPT_TIM_MACH = 1        # Cardiology
DEPT_THAN_KINH = 2       # Neurology
DEPT_NOI_KHOA = 3        # Internal Medicine
DEPT_TAI_MUI_HONG = 4    # ENT
DEPT_NHI_KHOA = 5        # Pediatrics
DEPT_CHINH_HINH = 6      # Orthopedics

# Define comprehensive mappings using ACTUAL symptom names from DB
# Format: (symptom_name, department_id, confidence)

# ============================================================================
# 1. TIM MACH (CARDIOLOGY) - Department ID: 1
# ============================================================================
cardiology_mappings = [
    # Heart beat
    ("Abnormalities of heart beat", DEPT_TIM_MACH, 0.95),
    ("Other and unspecified abnormalities of heart beat", DEPT_TIM_MACH, 0.95),
    ("Palpitations", DEPT_TIM_MACH, 0.95),
    
    # Chest pain
    ("Pain in throat and chest", DEPT_TIM_MACH, 0.90),
    ("Chest pain on breathing", DEPT_TIM_MACH, 0.90),
    ("Precordial pain", DEPT_TIM_MACH, 0.95),
    ("Other chest pain", DEPT_TIM_MACH, 0.90),
    ("Chest pain, unspecified", DEPT_TIM_MACH, 0.90),
    
    # Breathing
    ("Dyspnoea", DEPT_TIM_MACH, 0.85),
    ("Stridor", DEPT_TIM_MACH, 0.80),
    ("Other abnormalities of breathing", DEPT_TIM_MACH, 0.80),
    ("Abnormalities of breathing, unspecified", DEPT_TIM_MACH, 0.80),
    
    # Circulation
    ("Cyanosis", DEPT_TIM_MACH, 0.90),
    ("Localized swelling, mass and lump", DEPT_TIM_MACH, 0.70),
    ("Oedema, not elsewhere classified", DEPT_TIM_MACH, 0.80),
    
    # Other
    ("Shock, not elsewhere classified", DEPT_TIM_MACH, 0.85),
    ("Abnormal findings on diagnostic imaging of heart and coronary circulation", DEPT_TIM_MACH, 0.95),
]

# ============================================================================
# 2. THAN KINH (NEUROLOGY) - Department ID: 2
# ============================================================================
neurology_mappings = [
    # Headache
    ("Headache", DEPT_THAN_KINH, 0.95),
    
    # Dizziness
    ("Dizziness and giddiness", DEPT_THAN_KINH, 0.95),
    ("Disturbances of smell and taste", DEPT_THAN_KINH, 0.85),
    
    # Movement disorders
    ("Abnormal involuntary movements", DEPT_THAN_KINH, 0.95),
    ("Abnormal head movements", DEPT_THAN_KINH, 0.95),
    ("Tremor, unspecified", DEPT_THAN_KINH, 0.95),
    ("Ataxic gait", DEPT_THAN_KINH, 0.90),
    ("Paralytic gait", DEPT_THAN_KINH, 0.95),
    ("Other abnormalities of gait and mobility", DEPT_THAN_KINH, 0.90),
    ("Abnormality of gait and mobility, unspecified", DEPT_THAN_KINH, 0.85),
    
    # Reflexes & sensory
    ("Abnormal reflex", DEPT_THAN_KINH, 0.90),
    ("Abnormal posture", DEPT_THAN_KINH, 0.85),
    ("Other lack of coordination", DEPT_THAN_KINH, 0.90),
    ("Lack of coordination, unspecified", DEPT_THAN_KINH, 0.85),
    ("Unsteadiness on feet", DEPT_THAN_KINH, 0.85),
    ("Disturbances of skin sensation", DEPT_THAN_KINH, 0.85),
    
    # Consciousness
    ("Altered mental status, unspecified", DEPT_THAN_KINH, 0.90),
    ("Borderline intellectual functioning", DEPT_THAN_KINH, 0.80),
    ("Somnolence", DEPT_THAN_KINH, 0.85),
    ("Stupor", DEPT_THAN_KINH, 0.90),
    ("Coma, unspecified", DEPT_THAN_KINH, 0.95),
    
    # Convulsions
    ("Convulsions, not elsewhere classified", DEPT_THAN_KINH, 0.95),
    
    # Memory
    ("Amnesia", DEPT_THAN_KINH, 0.90),
    ("Other symptoms and signs involving cognitive functions and awareness", DEPT_THAN_KINH, 0.85),
    
    # Vision
    ("Visual disturbances", DEPT_THAN_KINH, 0.85),
    
    # Speech
    ("Speech disturbances, not elsewhere classified", DEPT_THAN_KINH, 0.90),
    ("Dysarthria and anarthria", DEPT_THAN_KINH, 0.95),
    ("Other speech disturbances", DEPT_THAN_KINH, 0.90),
    ("Speech disturbance, unspecified", DEPT_THAN_KINH, 0.85),
    
    # Imaging
    ("Abnormal findings in cerebrospinal fluid", DEPT_THAN_KINH, 0.95),
    ("Abnormal findings on diagnostic imaging of central nervous system", DEPT_THAN_KINH, 0.90),
]

# ============================================================================
# 3. NOI KHOA (INTERNAL MEDICINE) - Department ID: 3
# ============================================================================
internal_medicine_mappings = [
    # Fever
    ("Fever of other and unknown origin", DEPT_NOI_KHOA, 0.90),
    ("Drug-induced fever", DEPT_NOI_KHOA, 0.85),
    ("Other specified fever", DEPT_NOI_KHOA, 0.90),
    ("Fever, unspecified", DEPT_NOI_KHOA, 0.90),
    ("Chills (without fever)", DEPT_NOI_KHOA, 0.85),
    
    # Respiratory
    ("Cough", DEPT_NOI_KHOA, 0.90),
    ("Hiccough", DEPT_NOI_KHOA, 0.75),
    ("Sneezing", DEPT_NOI_KHOA, 0.80),
    ("Dyspnoea", DEPT_NOI_KHOA, 0.85),
    ("Wheezing", DEPT_NOI_KHOA, 0.90),
    ("Stridor", DEPT_NOI_KHOA, 0.85),
    ("Haemoptysis", DEPT_NOI_KHOA, 0.90),
    
    # GI symptoms
    ("Abdominal and pelvic pain", DEPT_NOI_KHOA, 0.90),
    ("Abdominal rigidity", DEPT_NOI_KHOA, 0.90),
    ("Abnormal bowel sounds", DEPT_NOI_KHOA, 0.85),
    ("Nausea and vomiting", DEPT_NOI_KHOA, 0.90),
    ("Heartburn", DEPT_NOI_KHOA, 0.85),
    ("Dysphagia", DEPT_NOI_KHOA, 0.85),
    ("Flatulence and related conditions", DEPT_NOI_KHOA, 0.80),
    ("Faecal incontinence", DEPT_NOI_KHOA, 0.85),
    ("Change in bowel habit", DEPT_NOI_KHOA, 0.85),
    ("Abnormal faeces", DEPT_NOI_KHOA, 0.85),
    
    # Urinary
    ("Retention of urine", DEPT_NOI_KHOA, 0.85),
    ("Unspecified urinary incontinence", DEPT_NOI_KHOA, 0.85),
    ("Frequency of micturition", DEPT_NOI_KHOA, 0.85),
    ("Polyuria", DEPT_NOI_KHOA, 0.85),
    ("Oliguria and anuria", DEPT_NOI_KHOA, 0.90),
    ("Other specified symptoms and signs involving the urinary system", DEPT_NOI_KHOA, 0.85),
    ("Symptoms and signs involving the urinary system, unspecified", DEPT_NOI_KHOA, 0.85),
    
    # General symptoms
    ("Malaise and fatigue", DEPT_NOI_KHOA, 0.85),
    ("Senility", DEPT_NOI_KHOA, 0.80),
    ("Cachexia", DEPT_NOI_KHOA, 0.90),
    ("Abnormalities of weight gain", DEPT_NOI_KHOA, 0.85),
    ("Abnormal loss of weight", DEPT_NOI_KHOA, 0.85),
    ("Feeding difficulties and mismanagement", DEPT_NOI_KHOA, 0.80),
    ("Lack of expected normal physiological development", DEPT_NOI_KHOA, 0.80),
    
    # Blood pressure
    ("Abnormal blood-pressure reading, without diagnosis", DEPT_NOI_KHOA, 0.85),
    
    # Lab findings
    ("Abnormal finding of blood chemistry, unspecified", DEPT_NOI_KHOA, 0.80),
    ("Abnormal level of blood mineral", DEPT_NOI_KHOA, 0.80),
    ("Abnormal glucose tolerance test", DEPT_NOI_KHOA, 0.85),
    ("Abnormal immunological finding in serum, unspecified", DEPT_NOI_KHOA, 0.80),
]

# ============================================================================
# 4. TAI MUI HONG (ENT) - Department ID: 4
# ============================================================================
ent_mappings = [
    # Throat
    ("Pain in throat", DEPT_TAI_MUI_HONG, 0.95),
    ("Pain in throat and chest", DEPT_TAI_MUI_HONG, 0.85),
    ("Haemorrhage from throat", DEPT_TAI_MUI_HONG, 0.95),
    ("Other specified symptoms and signs involving the circulatory and respiratory systems", DEPT_TAI_MUI_HONG, 0.75),
    
    # Respiratory
    ("Cough", DEPT_TAI_MUI_HONG, 0.85),
    ("Sneezing", DEPT_TAI_MUI_HONG, 0.90),
    ("Epistaxis", DEPT_TAI_MUI_HONG, 0.95),
    ("Other haemorrhage from respiratory passages", DEPT_TAI_MUI_HONG, 0.95),
    ("Abnormal sputum", DEPT_TAI_MUI_HONG, 0.85),
    
    # Nose
    ("Disturbances of smell and taste", DEPT_TAI_MUI_HONG, 0.90),
    
    # Voice
    ("Voice disturbance", DEPT_TAI_MUI_HONG, 0.95),
    
    # Ear balance
    ("Dizziness and giddiness", DEPT_TAI_MUI_HONG, 0.80),
    
    # Abnormal findings
    ("Abnormal findings in specimens from respiratory organs and thorax", DEPT_TAI_MUI_HONG, 0.85),
]

# ============================================================================
# 5. NHI KHOA (PEDIATRICS) - Department ID: 5
# ============================================================================
pediatrics_mappings = [
    # Development
    ("Feeding difficulties and mismanagement", DEPT_NHI_KHOA, 0.90),
    ("Lack of expected normal physiological development", DEPT_NHI_KHOA, 0.90),
    ("Delayed milestone", DEPT_NHI_KHOA, 0.95),
    ("Abnormalities of weight gain", DEPT_NHI_KHOA, 0.85),
    
    # Common childhood symptoms
    ("Fever, unspecified", DEPT_NHI_KHOA, 0.80),
    ("Fever of other and unknown origin", DEPT_NHI_KHOA, 0.80),
    ("Cough", DEPT_NHI_KHOA, 0.80),
    ("Nausea and vomiting", DEPT_NHI_KHOA, 0.80),
    
    # Skin
    ("Rash and other nonspecific skin eruption", DEPT_NHI_KHOA, 0.85),
    ("Localized swelling, mass and lump of skin and subcutaneous tissue", DEPT_NHI_KHOA, 0.80),
    
    # Behavioral
    ("Symptoms and signs involving appearance and behaviour", DEPT_NHI_KHOA, 0.80),
    ("Irritability and anger", DEPT_NHI_KHOA, 0.80),
    ("Hostility", DEPT_NHI_KHOA, 0.75),
    
    # Congenital
    ("Other symptoms and signs involving the nervous and musculoskeletal systems", DEPT_NHI_KHOA, 0.75),
]

# ============================================================================
# 6. CHINH HINH (ORTHOPEDICS) - Department ID: 6
# ============================================================================
orthopedics_mappings = [
    # Joint pain
    ("Pain in joint", DEPT_CHINH_HINH, 0.95),
    ("Pain in limb", DEPT_CHINH_HINH, 0.95),
    ("Swelling, mass and lump in limb", DEPT_CHINH_HINH, 0.90),
    
    # Back & neck
    ("Dorsalgia", DEPT_CHINH_HINH, 0.95),
    ("Neck pain", DEPT_CHINH_HINH, 0.95),
    
    # Mobility
    ("Ataxic gait", DEPT_CHINH_HINH, 0.80),
    ("Paralytic gait", DEPT_CHINH_HINH, 0.85),
    ("Other abnormalities of gait and mobility", DEPT_CHINH_HINH, 0.90),
    ("Abnormality of gait and mobility, unspecified", DEPT_CHINH_HINH, 0.85),
    ("Unsteadiness on feet", DEPT_CHINH_HINH, 0.85),
    ("Other lack of coordination", DEPT_CHINH_HINH, 0.80),
    ("Lack of coordination, unspecified", DEPT_CHINH_HINH, 0.80),
    
    # Muscle & joints
    ("Muscle weakness (generalized)", DEPT_CHINH_HINH, 0.90),
    ("Other symptoms and signs involving the nervous and musculoskeletal systems", DEPT_CHINH_HINH, 0.85),
    ("Symptoms and signs involving the nervous and musculoskeletal systems, unspecified", DEPT_CHINH_HINH, 0.80),
    
    # Skeletal findings
    ("Abnormal findings on diagnostic imaging of limbs", DEPT_CHINH_HINH, 0.90),
    ("Abnormal findings on diagnostic imaging of other parts of musculoskeletal system", DEPT_CHINH_HINH, 0.90),
]

# Combine all mappings
all_mappings = (
    cardiology_mappings +
    neurology_mappings +
    internal_medicine_mappings +
    ent_mappings +
    pediatrics_mappings +
    orthopedics_mappings
)

print(f"\nTotal mappings to create: {len(all_mappings)}")

# Insert mappings
inserted = 0
skipped = 0
not_found = 0

for symptom_name, dept_id, confidence in all_mappings:
    if symptom_name in all_symptoms:
        symptom_id = all_symptoms[symptom_name]
        
        try:
            cursor.execute("""
                INSERT IGNORE INTO symptom_department_mapping 
                (symptom_id, department_id, confidence)
                VALUES (%s, %s, %s)
            """, (symptom_id, dept_id, confidence))
            
            if cursor.rowcount > 0:
                inserted += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"Error inserting {symptom_name}: {e}")
    else:
        not_found += 1
        # Don't print - too many

conn.commit()

# Get final statistics
cursor.execute("SELECT COUNT(*) as count FROM symptom_department_mapping")
total_mappings = cursor.fetchone()['count']

cursor.execute("""
    SELECT COUNT(DISTINCT symptom_id) as count 
    FROM symptom_department_mapping
""")
covered_symptoms = cursor.fetchone()['count']

# Get breakdown by department
cursor.execute("""
    SELECT d.name, COUNT(*) as count
    FROM symptom_department_mapping sdm
    JOIN departments d ON sdm.department_id = d.department_id
    GROUP BY d.department_id, d.name
""")
dept_breakdown = cursor.fetchall()

cursor.close()
conn.close()

# Print results
print("\n" + "=" * 70)
print("RESULTS")
print("=" * 70)
print(f"+ New mappings inserted: {inserted}")
print(f"= Already existed:       {skipped}")
print(f"- Symptoms not found:    {not_found}")

print(f"\nFINAL STATISTICS:")
print(f"  Total mappings in DB: {total_mappings}")
print(f"  Symptoms covered: {covered_symptoms}/341 ({covered_symptoms*100//341}%)")

print(f"\nMappings by Department:")
for dept in dept_breakdown:
    print(f"  {dept['name']}: {dept['count']} mappings")

print("\nDONE! Restart AI Service to apply changes.")
print("=" * 70)
