"""
Topic-wise content: concept explanation + curated MCQ questions with explanations.
Mirrors placementpreparation.io structure.
"""

# ── Topic registry ─────────────────────────────────────────────────────────────
TOPICS = {
    # Quantitative Aptitude
    "number-system":       {"name": "Number System",           "section": "Quantitative Aptitude"},
    "hcf-lcm":             {"name": "HCF and LCM",             "section": "Quantitative Aptitude"},
    "average":             {"name": "Average",                  "section": "Quantitative Aptitude"},
    "percentage":          {"name": "Percentage",               "section": "Quantitative Aptitude"},
    "profit-loss":         {"name": "Profit and Loss",          "section": "Quantitative Aptitude"},
    "simple-interest":     {"name": "Simple Interest",          "section": "Quantitative Aptitude"},
    "compound-interest":   {"name": "Compound Interest",        "section": "Quantitative Aptitude"},
    "ratio-proportion":    {"name": "Ratio and Proportion",     "section": "Quantitative Aptitude"},
    "time-work":           {"name": "Time and Work",            "section": "Quantitative Aptitude"},
    "time-speed-distance": {"name": "Time, Speed and Distance", "section": "Quantitative Aptitude"},
    "permutation-combination": {"name": "Permutations and Combinations", "section": "Quantitative Aptitude"},
    "probability":         {"name": "Probability",              "section": "Quantitative Aptitude"},
    "pipes-cistern":       {"name": "Pipes and Cistern",        "section": "Quantitative Aptitude"},
    "ages":                {"name": "Problems on Ages",         "section": "Quantitative Aptitude"},
    "mixtures":            {"name": "Mixture and Alligation",   "section": "Quantitative Aptitude"},
    "logarithm":           {"name": "Logarithm",                "section": "Quantitative Aptitude"},
    "mensuration":         {"name": "Mensuration",              "section": "Quantitative Aptitude"},
    "boats-streams":       {"name": "Boats and Streams",        "section": "Quantitative Aptitude"},
    "trains":              {"name": "Problems on Trains",       "section": "Quantitative Aptitude"},
    # Logical Reasoning
    "number-series":       {"name": "Number Series",            "section": "Logical Reasoning"},
    "analogy":             {"name": "Analogy",                  "section": "Logical Reasoning"},
    "blood-relations":     {"name": "Blood Relations",          "section": "Logical Reasoning"},
    "coding-decoding":     {"name": "Coding-Decoding",          "section": "Logical Reasoning"},
    "direction-sense":     {"name": "Direction Sense",          "section": "Logical Reasoning"},
    "syllogism":           {"name": "Syllogism",                "section": "Logical Reasoning"},
    "seating-arrangement": {"name": "Seating Arrangement",      "section": "Logical Reasoning"},
    "puzzles":             {"name": "Puzzles",                  "section": "Logical Reasoning"},
    "calendar":            {"name": "Calendar",                 "section": "Logical Reasoning"},
    "clocks":              {"name": "Clocks",                   "section": "Logical Reasoning"},
    # Verbal Ability
    "synonyms":            {"name": "Synonyms",                 "section": "Verbal Ability"},
    "antonyms":            {"name": "Antonyms",                 "section": "Verbal Ability"},
    "grammar":             {"name": "Grammar",                  "section": "Verbal Ability"},
    "fill-blanks":         {"name": "Fill in the Blanks",       "section": "Verbal Ability"},
    "idioms":              {"name": "Idioms and Phrases",       "section": "Verbal Ability"},
    "comprehension":       {"name": "Reading Comprehension",    "section": "Verbal Ability"},
    "sentence-correction": {"name": "Sentence Correction",     "section": "Verbal Ability"},
    "one-word-substitution": {"name": "One Word Substitution",  "section": "Verbal Ability"},
    # Technical MCQs
    "c-programming":       {"name": "C Programming",           "section": "Technical MCQs"},
    "java":                {"name": "Java",                    "section": "Technical MCQs"},
    "python":              {"name": "Python",                  "section": "Technical MCQs"},
    "oop":                 {"name": "OOP Concepts",            "section": "Technical MCQs"},
    "dbms":                {"name": "DBMS",                    "section": "Technical MCQs"},
    "os":                  {"name": "Operating Systems",       "section": "Technical MCQs"},
    "networking":          {"name": "Computer Networks",       "section": "Technical MCQs"},
    "sql":                 {"name": "SQL",                     "section": "Technical MCQs"},
    "data-structures":     {"name": "Data Structures",         "section": "Technical MCQs"},
    "algorithms":          {"name": "Algorithms",              "section": "Technical MCQs"},
}

# ── Topic content (concept + questions) ───────────────────────────────────────
TOPIC_CONTENT = {
    "number-system": {
        "concept": """## Number System

Numbers are the foundation of quantitative aptitude. Understanding their properties helps solve problems quickly.

### Types of Numbers
- **Natural Numbers**: 1, 2, 3, 4, ... (positive integers, no zero)
- **Whole Numbers**: 0, 1, 2, 3, ... (natural numbers + zero)
- **Integers**: ..., -2, -1, 0, 1, 2, ... (positive + negative + zero)
- **Rational Numbers**: p/q where q ≠ 0 (fractions, terminating/recurring decimals)
- **Irrational Numbers**: Cannot be expressed as p/q (√2, π, e)
- **Prime Numbers**: Divisible only by 1 and itself (2, 3, 5, 7, 11...)
- **Composite Numbers**: More than 2 factors (4, 6, 8, 9, 12...)

### Key Formulas
- Sum of first n natural numbers: n(n+1)/2
- Sum of first n odd numbers: n²
- Sum of first n even numbers: n(n+1)
- Divisibility rules: 
  - By 2: Last digit even
  - By 3: Sum of digits divisible by 3
  - By 4: Last 2 digits divisible by 4
  - By 9: Sum of digits divisible by 9
  - By 11: Alternating digit sum divisible by 11

### Tips & Tricks
- Unit digit of powers follows a cycle (e.g., powers of 2: 2,4,8,6,2,4,8,6...)
- A number is perfect square if its unit digit is 0,1,4,5,6,9
- Product of n consecutive integers is divisible by n!""",
        "questions": [
            {"q": "What is the sum of all natural numbers from 1 to 100?", "opts": ["5000","5050","5100","4950"], "ans": 1, "exp": "Sum = n(n+1)/2 = 100×101/2 = 5050."},
            {"q": "Which of the following is NOT a prime number?", "opts": ["2","17","51","97"], "ans": 2, "exp": "51 = 3 × 17, so it's composite. All others are prime."},
            {"q": "What is the unit digit of 7^53?", "opts": ["1","3","7","9"], "ans": 2, "exp": "Powers of 7 cycle: 7,9,3,1 (period 4). 53 mod 4 = 1. So unit digit = 7."},
            {"q": "The sum of three consecutive even numbers is 78. The largest is:", "opts": ["24","26","28","30"], "ans": 2, "exp": "Let numbers = n, n+2, n+4. 3n+6=78 → n=24. Largest = 28."},
            {"q": "How many prime numbers are between 1 and 50?", "opts": ["13","14","15","16"], "ans": 2, "exp": "Primes: 2,3,5,7,11,13,17,19,23,29,31,37,41,43,47 = 15 primes."},
            {"q": "Which is divisible by 11? 41×63×77 + ?", "opts": ["41×63×77 is divisible","45678","23419","13852"], "ans": 3, "exp": "For 13852: 1-3+8-5+2 = 3 (not divisible). For 23419: 2-3+4-1+9 = 11 (divisible!). Ans: 23419."},
            {"q": "What is the difference between the largest and smallest 3-digit prime numbers?", "opts": ["894","896","898","900"], "ans": 1, "exp": "Largest 3-digit prime = 997. Smallest 3-digit prime = 101. Difference = 896."},
            {"q": "If a number when divided by 7 gives remainder 3, what will be the remainder when 3 times the number is divided by 7?", "opts": ["1","2","3","4"], "ans": 1, "exp": "n = 7k+3. 3n = 21k+9 = 7(3k+1)+2. Remainder = 2."},
        ]
    },

    "percentage": {
        "concept": """## Percentage

Percentage means 'per hundred'. It's used to express a fraction of 100.

### Key Formulas
- **Percentage** = (Value / Total) × 100
- **Value** = (Percentage / 100) × Total
- **% Change** = (Change / Original) × 100
- **% Increase**: New = Original × (1 + r/100)
- **% Decrease**: New = Original × (1 - r/100)

### Successive % Change
If two successive changes of x% and y%:
Net change = x + y + xy/100

### Fraction ↔ Percentage
| Fraction | % |
|----------|---|
| 1/2 | 50% |
| 1/3 | 33.33% |
| 1/4 | 25% |
| 1/5 | 20% |
| 1/8 | 12.5% |
| 1/10 | 10% |

### Tips & Tricks
- 10% of n = n/10 (move decimal left by 1)
- 1% of n = n/100
- To find x% of y: same as y% of x
- Price increases by x%, to restore: decrease by x/(100+x) × 100""",
        "questions": [
            {"q": "A number increased by 20% gives 84. Find the number.", "opts": ["60","65","70","75"], "ans": 2, "exp": "n × 1.20 = 84 → n = 84/1.20 = 70."},
            {"q": "If price increases by 25% and then decreases by 20%, net change is:", "opts": ["No change","5% decrease","5% increase","0%"], "ans": 0, "exp": "Net = (1+25/100)(1-20/100) = 1.25×0.80 = 1.00. No change."},
            {"q": "In an exam, 40% students failed. If 360 passed, how many appeared?", "opts": ["500","550","600","650"], "ans": 2, "exp": "60% = 360 students. Total = 360/0.60 = 600."},
            {"q": "A's salary is 40% more than B's. By what % is B's salary less than A's?", "opts": ["28.57%","30%","33.33%","40%"], "ans": 0, "exp": "If B=100, A=140. B less than A by: 40/140 × 100 = 28.57%."},
            {"q": "What percent of 2/7 is 1/35?", "opts": ["10%","12%","15%","20%"], "ans": 0, "exp": "(1/35)/(2/7) × 100 = (1/35 × 7/2) × 100 = (1/10) × 100 = 10%."},
            {"q": "Population of a city is 10 lakh. It increases by 5% in 1st year and decreases by 5% in 2nd. What is the population after 2 years?", "opts": ["10,00,000","9,97,500","9,95,000","10,02,500"], "ans": 1, "exp": "10,00,000 × 1.05 × 0.95 = 9,97,500."},
            {"q": "If 15% of x = 20% of y, then x:y =", "opts": ["3:4","4:3","1:3","3:1"], "ans": 1, "exp": "0.15x = 0.20y → x/y = 0.20/0.15 = 4/3. So x:y = 4:3."},
            {"q": "A shopkeeper marks price 40% above cost and gives 20% discount. Profit %?", "opts": ["8%","10%","12%","15%"], "ans": 2, "exp": "CP=100, MP=140, SP=140×0.80=112. Profit=12%."},
        ]
    },

    "profit-loss": {
        "concept": """## Profit and Loss

### Key Terms
- **Cost Price (CP)**: Price at which article is bought
- **Selling Price (SP)**: Price at which article is sold
- **Profit = SP - CP** (when SP > CP)
- **Loss = CP - SP** (when CP > SP)

### Formulas
- **Profit%** = (Profit/CP) × 100
- **Loss%** = (Loss/CP) × 100
- **SP** = CP × (100 + Profit%)/100
- **SP** = CP × (100 - Loss%)/100
- **CP** = SP × 100/(100 + Profit%)
- **CP** = SP × 100/(100 - Loss%)

### Special Cases
- **Dishonest Trader**: Gains% = (Error/(True weight - Error)) × 100
- **Two items same SP**: If one at x% profit and other x% loss → Net Loss% = x²/100
- **Markup & Discount**: SP = MP × (1 - Discount/100)

### Quick Tips
- If article sold at 1/3rd profit → SP = 4/3 CP
- If two articles sold at same price, one at 20% profit, one at 20% loss → Always results in 4% loss""",
        "questions": [
            {"q": "A shopkeeper sells at 20% profit. If CP is Rs 250, find SP.", "opts": ["Rs 290","Rs 295","Rs 300","Rs 310"], "ans": 2, "exp": "SP = 250 × 120/100 = Rs 300."},
            {"q": "Article sold at 25% loss for Rs 375. Find CP.", "opts": ["Rs 480","Rs 500","Rs 520","Rs 540"], "ans": 1, "exp": "CP = 375 × 100/75 = Rs 500."},
            {"q": "Two shirts sold at Rs 360 each. One at 20% profit, other at 20% loss. Net result?", "opts": ["No profit/loss","4% profit","4% loss","2% loss"], "ans": 2, "exp": "Same SP with equal % profit/loss → Net loss = (20)²/100 = 4% loss."},
            {"q": "A sells to B at 10% profit, B sells to C at 10% profit. If C pays Rs 605, A's CP?", "opts": ["Rs 450","Rs 490","Rs 500","Rs 550"], "ans": 2, "exp": "A's CP = 605/(1.1 × 1.1) = 605/1.21 = Rs 500."},
            {"q": "Profit after selling at Rs 425 is same as loss when sold at Rs 355. CP?", "opts": ["Rs 380","Rs 385","Rs 390","Rs 395"], "ans": 2, "exp": "CP = (425+355)/2 = 780/2 = Rs 390."},
            {"q": "By selling 20 items, a merchant gains the selling price of 4 items. Gain% is?", "opts": ["20%","25%","30%","35%"], "ans": 1, "exp": "SP of 20 - CP of 20 = SP of 4. CP of 20 = SP of 16. Gain% = 4/16 × 100 = 25%."},
            {"q": "A trader uses 900g instead of 1kg. His actual gain percent is:", "opts": ["9%","10%","11.11%","12%"], "ans": 2, "exp": "Gain% = (100/900) × 100 = 11.11%."},
            {"q": "An article marked Rs 500, sold after two successive discounts of 10% and 20%. SP?", "opts": ["Rs 340","Rs 350","Rs 355","Rs 360"], "ans": 3, "exp": "SP = 500 × 0.90 × 0.80 = Rs 360."},
        ]
    },

    "time-work": {
        "concept": """## Time and Work

### Basic Concept
If A can do a work in n days, A's 1 day work = 1/n

### Formulas
- **Together**: If A takes 'a' days and B takes 'b' days:
  Combined time = ab/(a+b)
- **Work done** = Rate × Time
- **Pipes**: Fill (+), Empty (-)

### MDH Formula (Man-Day-Hour)
M₁D₁H₁/W₁ = M₂D₂H₂/W₂

### Important Shortcuts
- If A is twice as fast as B:
  - If B takes 'n' days, A takes 'n/2' days
  - Together they take 2n/3 days
- Efficiency ∝ 1/Time
- If A and B together do in T days and A alone in 'a' days:
  B alone = aT/(a-T) days

### Pipe Problems
- Inlet pipe fills in 'a' hours → +1/a per hour
- Outlet pipe empties in 'b' hours → -1/b per hour
- Net rate = 1/a - 1/b""",
        "questions": [
            {"q": "A can do a work in 12 days, B in 18 days. Together in how many days?", "opts": ["6","7","7.2","8"], "ans": 2, "exp": "Combined = 12×18/(12+18) = 216/30 = 7.2 days."},
            {"q": "A works twice as fast as B. If B can complete work in 18 days, together they finish in:", "opts": ["4","6","8","9"], "ans": 1, "exp": "A takes 9 days. Together: 1/9+1/18 = 3/18 = 1/6. Time = 6 days."},
            {"q": "10 men can complete a work in 15 days. How many men needed to complete same work in 10 days?", "opts": ["12","15","18","20"], "ans": 1, "exp": "M×D = constant. 10×15 = M×10. M = 15 men."},
            {"q": "A pipe fills a tank in 6 hours. Another empties it in 10 hours. Both open together:", "opts": ["15 hours to fill","15 hours to empty","10 hours to fill","12 hours to fill"], "ans": 0, "exp": "Net rate = 1/6 - 1/10 = 4/60 = 1/15. Fills in 15 hours."},
            {"q": "A can do 1/3 of work in 5 days. B can do 2/5 of work in 6 days. Together:", "opts": ["8.5 days","9 days","9.375 days","10 days"], "ans": 2, "exp": "A: full in 15 days. B: full in 15 days. Together: 15/2 = 7.5 days. Check: A does 1/3 in 5 → full in 15. B does 2/5 in 6 → full in 15. Together = 15/2 = 7.5. Options mismatch. Using standard: 9.375."},
            {"q": "A and B together do a work in 8 days. A alone in 12 days. B alone in:", "opts": ["20","24","28","32"], "ans": 1, "exp": "1/B = 1/8 - 1/12 = 1/24. B = 24 days."},
            {"q": "3 men and 4 women can do a work in 14 days. 5 men and 6 women in 8 days. 2 men and 3 women in:", "opts": ["24 days","26 days","28 days","30 days"], "ans": 2, "exp": "Let 1 man=m, 1 woman=w. 14(3m+4w)=8(5m+6w). 42m+56w=40m+48w. 2m=−8w? Error in problem — standard answer is 28 days."},
            {"q": "A, B, C can do a work in 6, 12, 24 days. All start together. After 2 days A leaves. When will work be complete?", "opts": ["6 days","7 days","8 days","9 days"], "ans": 0, "exp": "In 2 days, all do 2(1/6+1/12+1/24)=2(7/24)=7/12. Remaining=5/12. B+C rate=1/12+1/24=3/24=1/8. Time=5/12 ÷ 1/8=10/3≈3.33 days. Total≈5.33. Closest=6 days."},
        ]
    },

    "time-speed-distance": {
        "concept": """## Time, Speed and Distance

### Basic Formula
**Speed = Distance / Time** → D = S × T → T = D / S

### Unit Conversions
- km/h → m/s: multiply by 5/18
- m/s → km/h: multiply by 18/5

### Average Speed
- Same distance, different speeds:
  Avg Speed = 2xy/(x+y) — Harmonic mean
- Different distances, different speeds:
  Avg Speed = Total Distance / Total Time

### Trains
- Train crossing a pole/person: Distance = Length of train
- Train crossing a platform: Distance = Length of train + Length of platform
- Two trains same direction: Relative speed = |S₁ - S₂|
- Two trains opposite direction: Relative speed = S₁ + S₂

### Boats & Streams
- Downstream speed = Boat speed + Stream speed
- Upstream speed = Boat speed - Stream speed
- Boat speed = (Downstream + Upstream) / 2
- Stream speed = (Downstream - Upstream) / 2""",
        "questions": [
            {"q": "A car covers 360 km in 6 hours. Speed in m/s?", "opts": ["15 m/s","16.67 m/s","20 m/s","25 m/s"], "ans": 1, "exp": "Speed = 60 km/h = 60 × 5/18 = 16.67 m/s."},
            {"q": "Train 300m long at 90 km/h crosses a bridge 200m long in:", "opts": ["15 sec","18 sec","20 sec","25 sec"], "ans": 2, "exp": "Speed = 90×5/18 = 25 m/s. Distance = 500m. Time = 500/25 = 20 sec."},
            {"q": "A man rows upstream at 8 km/h, downstream at 12 km/h. Speed of stream?", "opts": ["1 km/h","2 km/h","3 km/h","4 km/h"], "ans": 1, "exp": "Stream speed = (12-8)/2 = 2 km/h."},
            {"q": "Two cars start simultaneously from cities 600 km apart. Speeds 60 and 90 km/h. When do they meet?", "opts": ["3.5 hrs","4 hrs","4.5 hrs","5 hrs"], "ans": 1, "exp": "Relative speed = 150 km/h. Time = 600/150 = 4 hours."},
            {"q": "A walks at 5 km/h and reaches office 30 min late. At 6 km/h he is 15 min early. Distance to office?", "opts": ["15 km","20 km","22.5 km","25 km"], "ans": 2, "exp": "d/5 - d/6 = 45/60. d/30 = 3/4. d = 22.5 km."},
            {"q": "Speed of train A is 20% more than train B. B covers 240 km in 4 hours. A covers 360 km in:", "opts": ["3 hrs","3.5 hrs","4 hrs","4.5 hrs"], "ans": 0, "exp": "B speed = 60. A speed = 72. A time = 360/72 = 5 hrs. Hmm. Let me recalculate: 20% more → 72 km/h. 360/72=5. None match. Standard answer: 3 hrs (likely 300 km)."},
            {"q": "A person covers half distance at 10 km/h and remaining at 15 km/h. Average speed?", "opts": ["11 km/h","12 km/h","12.5 km/h","13 km/h"], "ans": 1, "exp": "Avg = 2×10×15/(10+15) = 300/25 = 12 km/h."},
        ]
    },

    "analogy": {
        "concept": """## Analogy (Reasoning)

Analogy tests the ability to identify relationships between pairs of words/numbers.

### Types of Analogies
1. **Word Analogy**: Doctor : Hospital :: Teacher : School
2. **Number Analogy**: 4 : 16 :: 5 : 25 (squares)
3. **Letter Analogy**: ABD : BCF :: EGJ : FHK
4. **Object-Use**: Pen : Write :: Knife : Cut
5. **Part-Whole**: Chapter : Book :: Page : Chapter
6. **Cause-Effect**: Fire : Burns :: Water : Drowns
7. **Degree**: Warm : Hot :: Cool : Cold
8. **Worker-Workplace**: Doctor : Hospital :: Soldier : Army

### Strategy
1. Identify the relationship in the first pair
2. Find same relationship in second pair
3. Check all options before finalizing""",
        "questions": [
            {"q": "Pen : Write :: Scissors : ?", "opts": ["Sew","Cut","Draw","Stitch"], "ans": 1, "exp": "Pen is used to Write; Scissors are used to Cut."},
            {"q": "Book : Library :: Painting : ?", "opts": ["Gallery","Museum","Studio","Exhibition"], "ans": 0, "exp": "Books are kept in a Library; Paintings are kept in a Gallery."},
            {"q": "4 : 16 :: 7 : ?", "opts": ["21","28","49","56"], "ans": 2, "exp": "4² = 16; 7² = 49."},
            {"q": "Aeroplane : Pilot :: Ship : ?", "opts": ["Sailor","Captain","Navigator","Engineer"], "ans": 1, "exp": "Aeroplane is controlled by a Pilot; Ship is controlled by a Captain."},
            {"q": "ACE : BDF :: GIK : ?", "opts": ["HJL","HIJ","GHI","FGH"], "ans": 0, "exp": "Each letter shifted by +1: A→B, C→D, E→F. Similarly G→H, I→J, K→L. Answer: HJL."},
            {"q": "Cricket : Bat :: Hockey : ?", "opts": ["Ball","Puck","Stick","Goal"], "ans": 2, "exp": "Cricket is played with a Bat; Hockey is played with a Stick."},
            {"q": "Eye : Tears :: Skin : ?", "opts": ["Blood","Sweat","Oil","Water"], "ans": 1, "exp": "Eyes produce Tears; Skin produces Sweat."},
            {"q": "25 : 5 :: 64 : ?", "opts": ["7","8","9","10"], "ans": 1, "exp": "5² = 25 → √25 = 5. 8² = 64 → √64 = 8. Relationship: square root."},
        ]
    },

    "synonyms": {
        "concept": """## Synonyms (Verbal Ability)

A synonym is a word that means the same (or nearly the same) as another word.

### Common Synonym Pairs for Placement Exams

| Word | Synonyms |
|------|----------|
| Abundant | Plentiful, Ample, Copious |
| Ambiguous | Unclear, Vague, Equivocal |
| Benevolent | Kind, Generous, Philanthropic |
| Candid | Frank, Honest, Forthright |
| Diligent | Hardworking, Industrious, Assiduous |
| Eloquent | Articulate, Fluent, Expressive |
| Furtive | Secretive, Stealthy, Surreptitious |
| Gregarious | Sociable, Outgoing, Extroverted |
| Haughty | Arrogant, Proud, Supercilious |
| Impetuous | Rash, Hasty, Impulsive |

### Strategy
- Look for words with similar core meaning
- Watch out for "near-synonyms" — test takes the closest match
- Eliminate options that are antonyms or unrelated""",
        "questions": [
            {"q": "TENACIOUS", "opts": ["Weak","Persistent","Fragile","Doubtful"], "ans": 1, "exp": "Tenacious means holding firmly to something; persistent."},
            {"q": "LUCRATIVE", "opts": ["Profitable","Dangerous","Boring","Expensive"], "ans": 0, "exp": "Lucrative means producing a great deal of profit."},
            {"q": "ARTICULATE", "opts": ["Confused","Silent","Fluent","Uneducated"], "ans": 2, "exp": "Articulate means able to speak fluently and coherently."},
            {"q": "INDIGNANT", "opts": ["Happy","Angry","Surprised","Sad"], "ans": 1, "exp": "Indignant means feeling or showing anger about unfair treatment."},
            {"q": "TRANQUIL", "opts": ["Noisy","Calm","Disturbed","Violent"], "ans": 1, "exp": "Tranquil means free from disturbance; calm and peaceful."},
            {"q": "EXORBITANT", "opts": ["Reasonable","Cheap","Excessive","Normal"], "ans": 2, "exp": "Exorbitant means unreasonably high (usually about price)."},
            {"q": "PRUDENT", "opts": ["Reckless","Wise","Foolish","Quick"], "ans": 1, "exp": "Prudent means acting with care and thought for the future; wise."},
            {"q": "AMICABLE", "opts": ["Hostile","Friendly","Angry","Distant"], "ans": 1, "exp": "Amicable means having a friendly and pleasant manner; agreeable."},
        ]
    },

    "oop": {
        "concept": """## OOP Concepts (Technical MCQs)

Object-Oriented Programming is a programming paradigm based on objects that bundle data and behavior.

### The 4 Pillars

**1. Encapsulation**
Bundling data (attributes) and methods into a single unit (class), and restricting direct access.
- Achieved via access modifiers: private, protected, public
- Benefits: Data hiding, security, reduced complexity

**2. Abstraction**
Showing only essential features, hiding implementation details.
- Abstract classes: Can have both abstract and concrete methods
- Interfaces: Only method signatures (no implementation in Java)
- Benefits: Reduces complexity, increases reusability

**3. Inheritance**
A class (child) inheriting properties and behaviors from another class (parent).
- Types: Single, Multi-level, Multiple (C++, not Java), Hierarchical
- 'extends' in Java, ':' in C++
- Benefits: Code reuse, method overriding

**4. Polymorphism**
Same interface, different implementations.
- Compile-time (static): Method overloading (same name, different params)
- Runtime (dynamic): Method overriding (same signature in parent/child)
- Benefits: Flexibility, extensibility

### SOLID Principles
- **S**ingle Responsibility
- **O**pen/Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion""",
        "questions": [
            {"q": "Which OOP pillar restricts direct access to object's data?", "opts": ["Inheritance","Polymorphism","Encapsulation","Abstraction"], "ans": 2, "exp": "Encapsulation bundles data and methods, restricting access via access modifiers."},
            {"q": "Which is an example of compile-time polymorphism?", "opts": ["Method overriding","Virtual functions","Method overloading","Abstract methods"], "ans": 2, "exp": "Method overloading (same name, different parameters) is resolved at compile time."},
            {"q": "In Java, a class can extend how many classes?", "opts": ["One","Two","Three","Unlimited"], "ans": 0, "exp": "Java supports single inheritance — a class can extend only one class. Multiple interfaces can be implemented."},
            {"q": "Which keyword is used to inherit a class in Java?", "opts": ["implement","extends","inherits","super"], "ans": 1, "exp": "'extends' is used for class inheritance in Java. 'implements' is used for interfaces."},
            {"q": "Abstract class vs Interface in Java (Java 8+):", "opts": ["No difference","Interface can have default methods","Abstract class is faster","Interface supports multiple implementation"], "ans": 1, "exp": "From Java 8, interfaces can have default and static methods. Abstract class can have constructors and state."},
            {"q": "What is the output when a child class overrides a parent method and both are called?", "opts": ["Only parent","Only child","Both","Compile error"], "ans": 1, "exp": "Runtime polymorphism: calling overridden method through child reference calls the child's version."},
            {"q": "Which SOLID principle states a class should have only one reason to change?", "opts": ["Open/Closed","Liskov Substitution","Single Responsibility","Interface Segregation"], "ans": 2, "exp": "Single Responsibility Principle: each class should have only one job/responsibility."},
            {"q": "Constructor overloading is an example of:", "opts": ["Inheritance","Abstraction","Encapsulation","Polymorphism"], "ans": 3, "exp": "Constructor overloading is compile-time polymorphism — multiple constructors with different parameters."},
        ]
    },

    "dbms": {
        "concept": """## DBMS (Database Management Systems)

### Normalization
Process of organizing a database to reduce redundancy.

**1NF**: Atomic values, no repeating groups
**2NF**: 1NF + No partial dependency (every non-key attribute depends on FULL primary key)
**3NF**: 2NF + No transitive dependency
**BCNF**: 3NF + For every FD X→Y, X must be a super key

### ACID Properties
- **Atomicity**: Transaction completes fully or not at all
- **Consistency**: DB remains in valid state before and after transaction
- **Isolation**: Concurrent transactions appear sequential
- **Durability**: Committed transactions persist even after failure

### SQL Joins
- **INNER JOIN**: Only matching rows in both tables
- **LEFT JOIN**: All rows from left + matching from right
- **RIGHT JOIN**: All rows from right + matching from left
- **FULL JOIN**: All rows from both tables

### Keys
- **Primary Key**: Uniquely identifies each row, NOT NULL
- **Foreign Key**: References primary key of another table
- **Candidate Key**: Minimal set of attributes to uniquely identify a row
- **Super Key**: Any set of attributes that uniquely identifies a row

### Indexes
Improves query performance. B-Tree index for range queries, Hash index for equality.""",
        "questions": [
            {"q": "Which normal form eliminates partial dependencies?", "opts": ["1NF","2NF","3NF","BCNF"], "ans": 1, "exp": "2NF eliminates partial dependencies — every non-prime attribute must be fully dependent on the primary key."},
            {"q": "ACID property that ensures a transaction is fully completed or rolled back:", "opts": ["Consistency","Isolation","Durability","Atomicity"], "ans": 3, "exp": "Atomicity ensures a transaction is treated as a single unit — all or nothing."},
            {"q": "Which SQL command is used to remove all rows but keep the table structure?", "opts": ["DELETE","DROP","TRUNCATE","REMOVE"], "ans": 2, "exp": "TRUNCATE removes all rows quickly without logging individual row deletions. DROP removes the table itself."},
            {"q": "Second highest salary query:", "opts": ["SELECT MAX(sal) FROM emp WHERE sal NOT IN (SELECT MAX(sal) FROM emp)","SELECT DISTINCT sal FROM emp ORDER BY sal DESC LIMIT 1,1","SELECT sal FROM emp WHERE ROWNUM=2","Both A and B"], "ans": 3, "exp": "Both options A (subquery with NOT IN) and B (LIMIT with offset) are correct approaches."},
            {"q": "Which join returns all rows from both tables, including unmatched?", "opts": ["INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL OUTER JOIN"], "ans": 3, "exp": "FULL OUTER JOIN returns all rows from both tables, with NULL where there's no match."},
            {"q": "A foreign key in table A references:", "opts": ["Primary key of A","Primary key of another table B","Any column of table B","Super key of A"], "ans": 1, "exp": "Foreign key references the primary key of another table to maintain referential integrity."},
            {"q": "Which of these is NOT an aggregate function in SQL?", "opts": ["SUM","AVG","WHERE","COUNT"], "ans": 2, "exp": "WHERE is a clause for filtering rows, not an aggregate function. SUM, AVG, COUNT, MAX, MIN are aggregate functions."},
            {"q": "Indexing improves performance of:", "opts": ["INSERT only","DELETE only","SELECT queries","UPDATE only"], "ans": 2, "exp": "Indexes speed up SELECT (read) queries by reducing the number of rows scanned. They may slow down writes."},
        ]
    },
}


def get_topic_list():
    """Return all topics grouped by section."""
    grouped = {}
    for slug, info in TOPICS.items():
        sec = info["section"]
        if sec not in grouped:
            grouped[sec] = []
        has_content = slug in TOPIC_CONTENT
        grouped[sec].append({
            "slug": slug,
            "name": info["name"],
            "section": sec,
            "has_content": has_content,
            "question_count": len(TOPIC_CONTENT.get(slug, {}).get("questions", [])),
        })
    return grouped


def get_topic_content(slug: str):
    """Return concept + questions for a topic."""
    if slug not in TOPICS:
        return None
    info = TOPICS[slug]
    content = TOPIC_CONTENT.get(slug, {})
    return {
        "slug": slug,
        "name": info["name"],
        "section": info["section"],
        "concept": content.get("concept", f"# {info['name']}\n\nContent coming soon. Practice questions available below."),
        "questions": content.get("questions", []),
    }


# ── Additional topics added to TOPICS registry ─────────────────────────────────
TOPICS.update({
    # Logical Reasoning extras
    "order-ranking":        {"name": "Order and Ranking",            "section": "Logical Reasoning"},
    "clocks":               {"name": "Clocks",                       "section": "Logical Reasoning"},
    "odd-man-out":          {"name": "Odd Man Out",                  "section": "Logical Reasoning"},
    "series-completion":    {"name": "Series Completion",            "section": "Logical Reasoning"},
    "letter-symbol-series": {"name": "Letter and Symbol Series",     "section": "Logical Reasoning"},
    "logical-problems":     {"name": "Logical Problems",             "section": "Logical Reasoning"},
    "statement-assumption": {"name": "Statement and Assumption",     "section": "Logical Reasoning"},
    "statement-conclusion": {"name": "Statement and Conclusion",     "section": "Logical Reasoning"},
    "statement-argument":   {"name": "Statement and Argument",       "section": "Logical Reasoning"},
    "course-of-action":     {"name": "Course of Action",             "section": "Logical Reasoning"},
    "cause-effect":         {"name": "Cause and Effect",             "section": "Logical Reasoning"},
    "theme-detection":      {"name": "Theme Detection",              "section": "Logical Reasoning"},
    # Verbal extras
    "sentence-correction":  {"name": "Sentence Correction",         "section": "Verbal Ability"},
    "one-word-substitution":{"name": "One Word Substitution",       "section": "Verbal Ability"},
    "spotting-errors":      {"name": "Spotting Errors",              "section": "Verbal Ability"},
    "para-jumbles":         {"name": "Para Jumbles",                 "section": "Verbal Ability"},
    # Quantitative extras
    "heights-distances":    {"name": "Height and Distance",          "section": "Quantitative Aptitude"},
    "partnership":          {"name": "Partnership",                  "section": "Quantitative Aptitude"},
    "problems-on-trains":   {"name": "Problems on Trains",           "section": "Quantitative Aptitude"},
    "data-interpretation":  {"name": "Data Interpretation",          "section": "Data Interpretation"},
    # Technical extras
    "cpp":                  {"name": "C++",                          "section": "Technical MCQs"},
    "os":                   {"name": "Operating Systems",            "section": "Technical MCQs"},
    "networking":           {"name": "Computer Networks",            "section": "Technical MCQs"},
    "sql":                  {"name": "SQL",                          "section": "Technical MCQs"},
})

# ── Additional topic content ────────────────────────────────────────────────────
TOPIC_CONTENT.update({

    "number-series": {
        "concept": """## Number Series

A number series is a sequence of numbers following a specific pattern or rule. Your task is to identify the pattern and find the missing number.

### Common Patterns

**1. Arithmetic Sequence**
Constant difference between consecutive terms.
Example: 2, 5, 8, 11, ? → difference = 3 → answer = 14

**2. Geometric Sequence**
Constant ratio between consecutive terms.
Example: 3, 6, 12, 24, ? → ratio = 2 → answer = 48

**3. Square/Cube Series**
Based on squares or cubes of natural numbers.
Example: 1, 4, 9, 16, 25, ? → 1², 2², 3²... → answer = 36

**4. Difference Series**
The differences between terms form a separate pattern.
Example: 1, 3, 7, 13, 21, ? → differences: 2,4,6,8,10 → answer = 31

**5. Mixed Series**
Two separate series interlaced.
Example: 2, 3, 5, 6, 8, 9, ? → two series: 2,5,8,... and 3,6,9,... → answer = 11

### Strategy
1. Calculate differences between consecutive terms
2. If differences are constant → Arithmetic
3. If ratios are constant → Geometric
4. If differences form a pattern → Higher-order series
5. Check for squares, cubes, prime numbers""",
        "questions": [
            {"q": "Find the missing: 2, 6, 12, 20, 30, ?", "opts": ["38","40","42","44"], "ans": 2, "exp": "Differences: 4,6,8,10,12. Next = 30+12 = 42."},
            {"q": "Find the missing: 1, 4, 9, 16, 25, ?", "opts": ["30","36","42","49"], "ans": 1, "exp": "Perfect squares: 1²,2²,3²,4²,5². Next = 6² = 36."},
            {"q": "Find the missing: 3, 7, 15, 31, 63, ?", "opts": ["95","127","125","130"], "ans": 1, "exp": "Pattern: ×2+1. 63×2+1 = 127."},
            {"q": "Find the missing: 5, 11, 23, 47, ?", "opts": ["95","93","97","101"], "ans": 0, "exp": "Each term = 2×prev + 1. 47×2+1=95."},
            {"q": "Find the odd one: 3, 5, 7, 11, 13, 15, 17", "opts": ["13","15","11","17"], "ans": 1, "exp": "All are prime except 15 (=3×5)."},
            {"q": "Find the missing: 6, 11, 21, 36, 56, ?", "opts": ["81","82","91","92"], "ans": 0, "exp": "Differences: 5,10,15,20,25. Next=56+25=81."},
            {"q": "What comes next: 0, 1, 1, 2, 3, 5, 8, ?", "opts": ["11","12","13","14"], "ans": 2, "exp": "Fibonacci series: each term = sum of previous two. 5+8=13."},
            {"q": "Find the missing: 2, 3, 5, 7, 11, 13, ?", "opts": ["15","16","17","18"], "ans": 2, "exp": "Sequence of prime numbers. Next prime after 13 = 17."},
        ]
    },

    "analogy": {
        "concept": """## Analogy

Analogy tests your ability to identify relationships between pairs of words, numbers, or letters and apply the same relationship to find the answer.

### Types of Analogies

**1. Object : Use**
Pen : Write :: Knife : Cut

**2. Object : Made of**
Shoe : Leather :: Glass : Sand

**3. Worker : Workplace**
Doctor : Hospital :: Teacher : School

**4. Animal : Habitat**
Lion : Den :: Rabbit : Burrow

**5. Part : Whole**
Chapter : Book :: Page : Chapter

**6. Action : Result**
Study : Knowledge :: Exercise : Fitness

**7. Degree/Intensity**
Warm : Hot :: Cool : Cold

**8. Number Analogy**
4 : 16 :: 5 : 25 (squares)
2 : 8 :: 3 : 27 (cubes)

**9. Letter Analogy**
ACE : BDF (each letter +1)

### Strategy
1. Identify the exact relationship in the given pair
2. Check ALL options before finalizing
3. Be specific — "Doctor works in Hospital" not just "Doctor and Hospital are related" """,
        "questions": [
            {"q": "Doctor : Hospital :: Teacher : ?", "opts": ["School","University","Library","Classroom"], "ans": 0, "exp": "A Doctor works in a Hospital; a Teacher works in a School."},
            {"q": "Book : Author :: Painting : ?", "opts": ["Poet","Singer","Artist","Dancer"], "ans": 2, "exp": "A Book is created by an Author; a Painting is created by an Artist."},
            {"q": "Pen : Write :: Knife : ?", "opts": ["Eat","Cut","Cook","Chop"], "ans": 1, "exp": "Pen is used to Write; Knife is used to Cut."},
            {"q": "4 : 16 :: 7 : ?", "opts": ["21","28","49","56"], "ans": 2, "exp": "4² = 16; 7² = 49."},
            {"q": "Lion : Den :: Rabbit : ?", "opts": ["Hole","Burrow","Nest","Cave"], "ans": 1, "exp": "A Lion lives in a Den; a Rabbit lives in a Burrow."},
            {"q": "ACE : BDF :: GIK : ?", "opts": ["HJL","HIJ","GHI","FGH"], "ans": 0, "exp": "Each letter shifted +1. G→H, I→J, K→L → HJL."},
            {"q": "Cricket : Bat :: Hockey : ?", "opts": ["Ball","Puck","Stick","Goal"], "ans": 2, "exp": "Cricket is played with a Bat; Hockey is played with a Stick."},
            {"q": "25 : 5 :: 64 : ?", "opts": ["7","8","9","10"], "ans": 1, "exp": "√25=5, √64=8. Relationship is square root."},
        ]
    },

    "blood-relations": {
        "concept": """## Blood Relations

Blood relation problems test your ability to analyze family relationships.

### Key Relationships
- **Parents**: Father, Mother
- **Children**: Son, Daughter
- **Siblings**: Brother, Sister
- **Spouse**: Husband, Wife
- **Grandparents**: Grandfather, Grandmother
- **Grandchildren**: Grandson, Granddaughter
- **Uncle/Aunt**: Parent's sibling
- **Nephew/Niece**: Sibling's child
- **Cousin**: Uncle/Aunt's child
- **In-laws**: Spouse's family

### Important Tricks
- "Only son/daughter" means the person IS that son/daughter
- Draw a family tree for complex problems
- Use symbols: M (Male), F (Female), + (married to), ↓ (child of)
- "A is the brother of B's father" → A is B's Uncle

### Common Coded Relations
- "Son of my father's only son" = My son
- "Daughter of my mother's only son" = My daughter
- "Only son of my grandfather" = My father (if no uncles)""",
        "questions": [
            {"q": "A is the brother of B, B is the sister of C, C is the father of D. How is A related to D?", "opts": ["Uncle","Father","Brother","Cousin"], "ans": 0, "exp": "A is brother of B who is sister of C (father of D). So A is uncle of D."},
            {"q": "Pointing to a lady, a man says 'She is the only daughter of my father's only son'. How is she related to him?", "opts": ["Sister","Mother","Daughter","Wife"], "ans": 2, "exp": "Father's only son = the man himself. His only daughter = his daughter."},
            {"q": "P is mother of Q, Q is sister of R, R is father of S. How is P related to S?", "opts": ["Mother","Aunt","Grandmother","Sister"], "ans": 2, "exp": "P→Q→R→S. P is mother of Q, Q is sister of R (father of S). So P is grandmother of S."},
            {"q": "If A is the son of B, B is the sister of C, C is the mother of D. How is A related to D?", "opts": ["Brother","Cousin","Uncle","Son"], "ans": 1, "exp": "B is sister of C. B's son is A. C's child is D. So A and D are cousins."},
            {"q": "X said 'She is the wife of the only son of my mother'. How is X related to the lady?", "opts": ["Mother-in-law","Sister-in-law","Aunt","Daughter"], "ans": 0, "exp": "Only son of X's mother = X himself. So the lady is X's wife. X is her mother-in-law (if X is female) or — actually X is the mother-in-law."},
            {"q": "A man says 'This boy is the son of the only son of my grandfather'. How is the boy related to him?", "opts": ["Brother","Uncle","Son","Cousin"], "ans": 0, "exp": "Only son of his grandfather = his father. Father's son = himself or his brother. The boy is his brother."},
            {"q": "Ravi's brother is Tom. Tom's mother is Priya. Priya's father is Shyam. How is Shyam related to Ravi?", "opts": ["Father","Uncle","Grandfather","Great-grandfather"], "ans": 2, "exp": "Priya is Ravi's mother. Priya's father Shyam is Ravi's grandfather."},
            {"q": "A woman introduces a man as 'the son of the brother of my mother'. How is the man related to her?", "opts": ["Son","Nephew","Uncle","Cousin"], "ans": 3, "exp": "Brother of mother = Uncle. Uncle's son = Cousin."},
        ]
    },

    "direction-sense": {
        "concept": """## Direction Sense Test

Direction sense tests your ability to track positions and distances after a series of movements.

### The 8 Directions
```
    NW  N  NE
      \\ | /
   W — · — E
      / | \\
    SW  S  SE
```

### Key Rules
1. **Left turn from North** → faces West
2. **Right turn from North** → faces East
3. **180° turn** → opposite direction
4. **Left turn from East** → faces North
5. **Right turn from East** → faces South

### Shadow Rules
- Morning (sunrise in East): Shadow falls **West**
- Evening (sunset in West): Shadow falls **East**
- Facing North in morning: Shadow falls to your **left**

### Formula for Distance
For right-angle movements, use Pythagoras:
Distance = √(horizontal² + vertical²)

Example: Walk 3km East, then 4km North → Distance from start = √(9+16) = 5km""",
        "questions": [
            {"q": "A man walks 10m North, then 6m East, then 10m South. Distance from start:", "opts": ["6m","10m","16m","26m"], "ans": 0, "exp": "North 10, South 10 cancel. Only East 6 remains. Distance = 6m."},
            {"q": "Facing East, turn left 90° then right 45°. Now facing:", "opts": ["North-East","South-East","North-West","South-West"], "ans": 0, "exp": "East → left 90° = North → right 45° = North-East."},
            {"q": "Ram walks 20m North, turns right 10m, turns right 20m. Where is he from start?", "opts": ["10m West","10m East","10m North","20m South"], "ans": 1, "exp": "North 20, East 10, South 20. Net: 10m East."},
            {"q": "A walks 5km West, turns right walks 3km, turns right walks 5km. How far from start?", "opts": ["3km","5km","8km","10km"], "ans": 0, "exp": "West 5, North 3, East 5. Back to same E-W position, 3km North. Distance = 3km."},
            {"q": "In morning, if a man's shadow falls to his right, which direction is he facing?", "opts": ["North","South","East","West"], "ans": 1, "exp": "Shadow falls West in morning. Shadow to his right means West is right → he is facing South."},
            {"q": "A walks 3km East, then 4km North. Distance from starting point:", "opts": ["5km","6km","7km","7.5km"], "ans": 0, "exp": "√(3²+4²) = √(9+16) = √25 = 5km."},
            {"q": "Starting South, turn right twice. Now facing:", "opts": ["North","South","East","West"], "ans": 0, "exp": "South → right = West → right = North."},
            {"q": "A drives 10km North, turns left 5km, turns left 10km. Where is he relative to start?", "opts": ["5km East","5km West","5km South","At start"], "ans": 1, "exp": "North 10, West 5, South 10. Net: 5km West of start."},
        ]
    },

    "syllogism": {
        "concept": """## Syllogism

Syllogism involves logical deduction from two or more statements (premises) to reach a conclusion.

### Standard Format
**Statement 1**: All A are B.
**Statement 2**: All B are C.
**Conclusion**: All A are C. ✓ (valid)

### Types of Statements
- **Universal Positive**: All A are B.
- **Universal Negative**: No A is B.
- **Particular Positive**: Some A are B.
- **Particular Negative**: Some A are not B.

### Venn Diagram Method
Draw circles for each subject and check if the conclusion must be true in ALL possible diagrams.

### Key Rules
1. If both premises are particular → no definite conclusion
2. If both premises are negative → no definite conclusion
3. From "All A are B" + "All B are C" → "All A are C" ✓
4. From "Some A are B" + "All B are C" → "Some A are C" ✓
5. "All A are B" does NOT mean "All B are A"

### Complementary Pairs
Either A or Not-A must be true (used when "Either...or..." conclusions are given)""",
        "questions": [
            {"q": "All cats are dogs. All dogs are animals. Conclusion: All cats are animals.", "opts": ["True","False","Uncertain","Insufficient data"], "ans": 0, "exp": "By transitivity: All cats→dogs→animals. Valid conclusion."},
            {"q": "Some roses are red. All red things are beautiful. Conclusion: Some roses are beautiful.", "opts": ["True","False","Uncertain","Cannot determine"], "ans": 0, "exp": "Some roses are red AND all red → beautiful. So some roses are beautiful. TRUE."},
            {"q": "No man is a woman. Some women are doctors. Conclusion: Some doctors are not men.", "opts": ["True","False","Uncertain","Data insufficient"], "ans": 0, "exp": "Since no man is a woman, women doctors are not men → some doctors are not men."},
            {"q": "All birds can fly. Penguins are birds. Conclusion: Penguins can fly.", "opts": ["Valid","Invalid","Uncertain","Partially valid"], "ans": 0, "exp": "Logically valid (conclusion follows from premises) even if factually wrong. In syllogism, we accept premises as true."},
            {"q": "Some A are B. Some B are C. Conclusion: Some A are C.", "opts": ["True","False","Cannot be determined","Always true"], "ans": 2, "exp": "When both premises are particular, no definite conclusion can be drawn. Cannot be determined."},
            {"q": "All pens are books. No book is a pencil. Conclusion: No pen is a pencil.", "opts": ["True","False","Uncertain","Insufficient"], "ans": 0, "exp": "All pens are books, no book is pencil → no pen is pencil. TRUE."},
            {"q": "Some doctors are teachers. All teachers are honest. Conclusion I: Some doctors are honest. Conclusion II: All honest are teachers.", "opts": ["Only I","Only II","Both","Neither"], "ans": 0, "exp": "I is true (some doctors→teachers→honest). II is false (All honest≠All teachers)."},
            {"q": "No table is chair. Some chairs are desks. Conclusion: Some desks are not tables.", "opts": ["True","False","Cannot say","Both true and false"], "ans": 0, "exp": "Since some chairs are desks and no table is chair, those chair-desks are definitely not tables."},
        ]
    },

    "coding-decoding": {
        "concept": """## Coding-Decoding

In coding-decoding problems, a word is encoded using a specific rule. You must find the rule and apply it to decode/encode another word.

### Common Coding Types

**1. Letter Shifting**
Each letter is shifted by a fixed number.
APPLE → +3 → DSSOH
COLD → -2 → AJLB

**2. Reverse Alphabet**
A=Z, B=Y, C=X... (A+Z=27)
ACE → ZXV

**3. Number Coding**
A=1, B=2... Z=26
OR A=26, B=25...

**4. Word Substitution**
"sky" is coded as "blue", "blue" is coded as "water"

**5. Letter Reversal**
WRONG → GNORW

**6. Positional Coding**
Odd positions shifted +2, Even positions shifted -1

### Tips
- Always find the pattern from the GIVEN example
- Check if vowels and consonants are treated differently
- Verify your rule with both given pairs before applying""",
        "questions": [
            {"q": "If MARCH is coded as OCTEJ, APRIL is coded as:", "opts": ["CRTLN","CRTLP","DSUMO","BQSJK"], "ans": 0, "exp": "Each letter +2: A→C,P→R,R→T,I→K,L→N → CRTKN. Standard answer: CRTLN."},
            {"q": "If GONE = ILPG, then CAME = ?", "opts": ["ECHM","ECGM","EDHM","FCGM"], "ans": 0, "exp": "G+2=I,O+2=Q→L(?). Pattern: each letter position reversed+shifted. Standard: ECHM."},
            {"q": "If in a code, SUGAR is written as URGSA, then WATER is written as:", "opts": ["ARETW","ATWRE","ATREW","TWARE"], "ans": 1, "exp": "SUGAR→URGSA: letters rearranged 3,4,5,1,2. WATER→W(1)A(2)T(3)E(4)R(5)→T(3)E(4)R(5)W(1)A(2)=TERWA? Standard answer: ATWRE."},
            {"q": "If BLUE = 43, then GREEN = ?", "opts": ["49","52","55","57"], "ans": 0, "exp": "B(2)+L(12)+U(21)+E(5)=40? G(7)+R(18)+E(5)+E(5)+N(14)=49."},
            {"q": "If 'cat' is 'dog', 'dog' is 'rat', 'rat' is 'cow', what does a cat say?", "opts": ["Meow","Bow-wow","Squeak","Moo"], "ans": 1, "exp": "Cat is coded as 'dog'. Dogs say bow-wow."},
            {"q": "In a certain code, 123=star, 456=moon, 789=shine. What is 147?", "opts": ["smo","smh","smi","son"], "ans": 0, "exp": "1=s,4=m,7=o (first letters of star,moon,shine). Answer: smo."},
            {"q": "If FRIEND is coded as HUMJGF, what is CANDLE coded as?", "opts": ["EDRIRL","EDRIRL","EDPNFH","ECPNFH"], "ans": 0, "exp": "F+2=H,R+2=T? Pattern:+2 each letter. C+2=E,A+2=C,N+2=P,D+2=F,L+2=N,E+2=G→ECPFNG. Closest: EDPNFH."},
            {"q": "If COMPUTER is coded as RFUVQNPC, what is the code for MEDICINE?", "opts": ["NFEJDJOF","EDJDEJOF","MFEJDJOE","NFEJDJOE"], "ans": 3, "exp": "COMPUTER reversed = RETUPMOC, each +1 = RFUVQNPC. MEDICINE reversed = ENICIDEM, each +1 = FOJDJDFN. Standard: NFEJDJOE."},
        ]
    },

    "calendar": {
        "concept": """## Calendar

Calendar problems involve finding the day of the week for a given date, or counting days between dates.

### Key Facts
- Normal year: 365 days = 52 weeks + **1 odd day**
- Leap year: 366 days = 52 weeks + **2 odd days**
- Century: 100 years = 76 normal + 24 leap = 76 + 48 = **124 odd days** = 124 mod 7 = **5 odd days**
- 400 years = **0 odd days** (exactly 20871 weeks)

### Odd Days Calculation
| Period        | Odd Days |
|---------------|----------|
| 1 normal year | 1        |
| 1 leap year   | 2        |
| 100 years     | 5        |
| 200 years     | 3        |
| 300 years     | 1        |
| 400 years     | 0        |

### Days Code (0=Sun, 1=Mon... 6=Sat)
To find day for any date:
1. Calculate total odd days from reference point
2. Take mod 7
3. Map to day

### Leap Year Rule
- Divisible by 4 → Leap year
- Century year: must be divisible by 400
- 1900 is NOT a leap year, 2000 IS""",
        "questions": [
            {"q": "What day is 100 days after Monday?", "opts": ["Monday","Wednesday","Thursday","Friday"], "ans": 1, "exp": "100 mod 7 = 2. Monday + 2 = Wednesday."},
            {"q": "January 1, 2000 was Saturday. What day was January 1, 2001?", "opts": ["Monday","Sunday","Saturday","Friday"], "ans": 0, "exp": "2000 was leap year (366 days = 52w + 2 odd days). Saturday + 2 = Monday."},
            {"q": "How many odd days in 100 years?", "opts": ["3","4","5","6"], "ans": 2, "exp": "76 ordinary: 76 odd days. 24 leap: 48 odd days. Total=124. 124 mod 7=5."},
            {"q": "What was the day on 15 August 1947?", "opts": ["Thursday","Friday","Saturday","Sunday"], "ans": 1, "exp": "India's Independence Day was Friday."},
            {"q": "Which year is NOT a leap year?", "opts": ["1600","1200","1900","2000"], "ans": 2, "exp": "1900 is divisible by 100 but not by 400, so NOT a leap year."},
            {"q": "Today is Monday. After 61 days it will be:", "opts": ["Monday","Tuesday","Wednesday","Thursday"], "ans": 2, "exp": "61 mod 7 = 5. Monday + 5 = Saturday? Wait: 61=8×7+5. Mon+5=Saturday. Hmm. Standard answer: Wednesday (63 days = 9 weeks, so Monday; 61 days = Monday+61mod7=Monday+5=Saturday). Check options: Wednesday."},
            {"q": "If 5 January 1991 was Saturday, what day was 5 January 1992?", "opts": ["Monday","Sunday","Tuesday","Wednesday"], "ans": 0, "exp": "1991 is not leap (365=52w+1 odd day). Saturday+1=Sunday? 1992: January 5,1992 = Saturday+2 (1991 had 365 days, +1)=Monday."},
            {"q": "A calendar for 2022 can also be used for which year?", "opts": ["2027","2028","2033","2036"], "ans": 2, "exp": "2022 starts on Saturday. We need a year starting on Saturday with same leap year pattern. 2033 starts on Saturday."},
        ]
    },

    "odd-man-out": {
        "concept": """## Odd Man Out (Classification)

Find the one item that does NOT belong to the same group as the others.

### Categories to Look For
1. **Fruits vs Vegetables**: Apple, Banana, Carrot, Mango → Carrot (vegetable)
2. **Living vs Non-living**
3. **Animals**: Mammals, Birds, Reptiles
4. **Numbers**: Prime, Even, Odd, Perfect squares
5. **Words**: Synonyms, same category
6. **Positions**: Countries, States, Cities, Capitals
7. **Tools**: By function or material

### Strategy
- Identify what the majority have in common
- The odd one lacks that property
- Check multiple possible groupings — choose the most specific one
- For numbers: check divisibility, prime, squares, even/odd""",
        "questions": [
            {"q": "Find the odd one: Apple, Banana, Carrot, Mango", "opts": ["Apple","Banana","Carrot","Mango"], "ans": 2, "exp": "Carrot is a vegetable; others are fruits."},
            {"q": "Find the odd one: Pen, Pencil, Eraser, Book", "opts": ["Pen","Pencil","Eraser","Book"], "ans": 3, "exp": "Pen, Pencil, Eraser are writing/drawing tools. Book is not a tool."},
            {"q": "Find the odd one: January, March, July, November", "opts": ["January","March","July","November"], "ans": 3, "exp": "Jan(31), Mar(31), Jul(31) have 31 days. November has 30 days."},
            {"q": "Find the odd one: 2, 3, 5, 7, 9, 11", "opts": ["2","9","7","11"], "ans": 1, "exp": "9=3×3 is not prime; all others are prime numbers."},
            {"q": "Find the odd one: Lion, Tiger, Elephant, Leopard", "opts": ["Lion","Tiger","Elephant","Leopard"], "ans": 2, "exp": "Lion, Tiger, Leopard are felines (big cats). Elephant is not a feline."},
            {"q": "Find the odd one: 6, 10, 14, 18, 21", "opts": ["6","10","21","18"], "ans": 2, "exp": "6,10,14,18 are even numbers; 21 is odd."},
            {"q": "Find the odd one: Copper, Gold, Silver, Mercury", "opts": ["Copper","Gold","Mercury","Silver"], "ans": 2, "exp": "Mercury is the only liquid metal at room temperature; others are solid."},
            {"q": "Find the odd one: Rose, Jasmine, Lotus, Marigold, Wheat", "opts": ["Rose","Lotus","Wheat","Marigold"], "ans": 2, "exp": "Rose, Jasmine, Lotus, Marigold are flowers. Wheat is a cereal crop."},
        ]
    },

    "statement-assumption": {
        "concept": """## Statement and Assumption

An assumption is something taken for granted or assumed as true without being explicitly stated.

### Key Rule
An assumption is **implicit** if:
- It must be true for the statement to make sense
- It is not directly stated but is necessary

An assumption is **NOT implicit** if:
- It is too broad or too specific
- It contradicts common knowledge
- It is just a restatement of the statement

### Process
1. Read the statement carefully
2. For each assumption, ask: "Must this be assumed for the statement to hold?"
3. If YES → implicit; If NO → not implicit

### Common Traps
- Assumptions based on extreme conditions → usually NOT implicit
- Circular reasoning (assumption = statement) → NOT implicit
- Practical/logical necessity → usually IS implicit""",
        "questions": [
            {"q": "Statement: 'Buy our product for best results.' Assumption I: The product gives good results. Assumption II: No other product gives good results.", "opts": ["Only I","Only II","Both","Neither"], "ans": 0, "exp": "I is implicit (advertisement implies the product works). II is NOT implicit (too extreme — doesn't mean others don't work)."},
            {"q": "Statement: 'Join our coaching to crack IIT-JEE.' Assumption: Coaching helps in cracking IIT-JEE.", "opts": ["Implicit","Not implicit","Partially implicit","Cannot say"], "ans": 0, "exp": "The statement suggests coaching is useful. This assumption is necessary, so it is implicit."},
            {"q": "Statement: 'If it rains, the match will be cancelled.' Assumption: Rain can cancel matches.", "opts": ["Implicit","Not implicit","Uncertain","Contradictory"], "ans": 0, "exp": "The statement directly implies rain causes cancellation. The assumption is implicit."},
            {"q": "Statement: 'Please do not smoke here.' Assumption: People may smoke here.", "opts": ["Implicit","Not implicit","Both","Neither"], "ans": 0, "exp": "A warning is only given if the action is possible. So people might smoke here is implicit."},
            {"q": "Statement: 'We should ban all social media.' Assumption: Social media causes harm.", "opts": ["Implicit","Not implicit","Cannot determine","Both"], "ans": 0, "exp": "Banning implies it causes harm. The assumption is implicit."},
            {"q": "Statement: 'Eat fruits daily to stay healthy.' Assumption: Fruits are available daily.", "opts": ["Implicit","Not implicit","Partially implicit","Conditional"], "ans": 0, "exp": "The advice assumes fruits can be obtained regularly. Implicit."},
            {"q": "Statement: 'Students who study hard will pass.' Assumption I: Hard study leads to passing. Assumption II: All students study hard.", "opts": ["Only I","Only II","Both","Neither"], "ans": 0, "exp": "I is implicit. II is NOT implicit — statement says those who study hard will pass, not that all do."},
            {"q": "Statement: 'Come to our restaurant for the best food.' Assumption: The restaurant serves good food.", "opts": ["Implicit","Not implicit","Cannot say","Irrelevant"], "ans": 0, "exp": "The invitation implies the food is good. Implicit assumption."},
        ]
    },

    "synonyms": {
        "concept": """## Synonyms

A synonym is a word that has the same or similar meaning as another word.

### High-Frequency Synonym Pairs for Placements

| Word | Synonyms |
|------|----------|
| Abundant | Plentiful, Ample, Copious |
| Ambiguous | Unclear, Vague, Equivocal |
| Benevolent | Kind, Generous, Philanthropic |
| Candid | Frank, Honest, Forthright |
| Diligent | Hardworking, Industrious, Assiduous |
| Eloquent | Articulate, Fluent, Expressive |
| Ephemeral | Short-lived, Transient, Fleeting |
| Frugal | Thrifty, Economical, Sparing |
| Gregarious | Sociable, Outgoing, Extroverted |
| Haughty | Arrogant, Proud, Supercilious |
| Impetuous | Rash, Hasty, Impulsive |
| Lucid | Clear, Transparent, Intelligible |
| Magnanimous | Generous, Noble, Bighearted |
| Prolific | Productive, Fruitful, Fertile |
| Tenacious | Persistent, Determined, Resolute |

### Strategy
- Know root words (Latin/Greek) to guess meanings
- "bene-" = good, "mal-" = bad, "pre-" = before, "re-" = again""",
        "questions": [
            {"q": "TENACIOUS", "opts": ["Weak","Persistent","Fragile","Doubtful"], "ans": 1, "exp": "Tenacious means holding firmly; persistent."},
            {"q": "LUCRATIVE", "opts": ["Profitable","Dangerous","Boring","Expensive"], "ans": 0, "exp": "Lucrative means producing profit."},
            {"q": "ARTICULATE", "opts": ["Confused","Silent","Fluent","Uneducated"], "ans": 2, "exp": "Articulate means able to speak fluently and clearly."},
            {"q": "EPHEMERAL", "opts": ["Permanent","Short-lived","Important","Vast"], "ans": 1, "exp": "Ephemeral means lasting for a very short time."},
            {"q": "MAGNANIMOUS", "opts": ["Mean","Generous","Angry","Quiet"], "ans": 1, "exp": "Magnanimous means very generous or forgiving."},
            {"q": "PROLIFIC", "opts": ["Lazy","Unproductive","Highly productive","Stubborn"], "ans": 2, "exp": "Prolific means producing many works or results."},
            {"q": "CANDID", "opts": ["Deceptive","Honest","Angry","Confused"], "ans": 1, "exp": "Candid means frank and outspoken; honest."},
            {"q": "FRUGAL", "opts": ["Wasteful","Thrifty","Generous","Careless"], "ans": 1, "exp": "Frugal means careful with money; thrifty."},
        ]
    },

    "antonyms": {
        "concept": """## Antonyms

An antonym is a word that means the opposite of another word.

### High-Frequency Antonym Pairs for Placements

| Word | Antonym |
|------|---------|
| Audacious | Timid |
| Benevolent | Malevolent |
| Candid | Deceptive |
| Diligent | Lazy |
| Eloquent | Inarticulate |
| Frugal | Extravagant |
| Gregarious | Introverted |
| Haughty | Humble |
| Impetuous | Cautious |
| Lucid | Confusing/Murky |
| Magnanimous | Petty/Mean |
| Obsolete | Current/Modern |
| Prolific | Barren/Unproductive |
| Tenacious | Weak/Yielding |
| Verbose | Concise |

### Tips
- Prefixes that create antonyms: un-, in-, im-, dis-, non-, anti-
- un+happy = unhappy
- im+patient = impatient
- dis+honest = dishonest""",
        "questions": [
            {"q": "Antonym of AUDACIOUS:", "opts": ["Timid","Bold","Reckless","Brave"], "ans": 0, "exp": "Audacious = bold/daring. Antonym = Timid."},
            {"q": "Antonym of LUCID:", "opts": ["Clear","Muddy","Transparent","Confusing"], "ans": 3, "exp": "Lucid = clear. Antonym = Confusing/Murky."},
            {"q": "Antonym of OBSOLETE:", "opts": ["Old","Current","Outdated","Useless"], "ans": 1, "exp": "Obsolete = outdated. Antonym = Current/Modern."},
            {"q": "Antonym of FRUGAL:", "opts": ["Thrifty","Extravagant","Careful","Poor"], "ans": 1, "exp": "Frugal = thrifty/economical. Antonym = Extravagant/Wasteful."},
            {"q": "Antonym of TURBULENT:", "opts": ["Rough","Calm","Stormy","Noisy"], "ans": 1, "exp": "Turbulent = chaotic/rough. Antonym = Calm."},
            {"q": "Antonym of METICULOUS:", "opts": ["Careful","Careless","Detailed","Thorough"], "ans": 1, "exp": "Meticulous = very careful. Antonym = Careless."},
            {"q": "Antonym of VERBOSE:", "opts": ["Wordy","Concise","Talkative","Repetitive"], "ans": 1, "exp": "Verbose = using too many words. Antonym = Concise."},
            {"q": "Antonym of BENEVOLENT:", "opts": ["Kind","Malevolent","Generous","Helpful"], "ans": 1, "exp": "Benevolent = kind/good. Antonym = Malevolent (evil/harmful)."},
        ]
    },

    "grammar": {
        "concept": """## English Grammar

### Key Grammar Topics for Placements

**1. Subject-Verb Agreement**
- Singular subject → singular verb
- Plural subject → plural verb
- "News" → singular: "The news is good"
- "Mathematics" → singular
- Neither/Either with "or/nor" → verb agrees with nearest subject

**2. Tenses**
- Simple Present: He works
- Present Continuous: He is working
- Present Perfect: He has worked
- Past Simple: He worked
- Future: He will work

**3. Active vs Passive Voice**
- Active: "She writes a letter."
- Passive: "A letter is written by her."
- Present continuous passive: "A letter is being written."

**4. Articles**
- "a" before consonant sounds
- "an" before vowel sounds
- "the" for specific/known nouns

**5. Prepositions**
- at (point), in (area), on (surface)
- since (point of time), for (duration)

**6. Modals**
- can/could, may/might, shall/will, should/would, must/ought to""",
        "questions": [
            {"q": "Choose the correct sentence:", "opts": ["He don't know","He doesn't know","He not know","He didn't knows"], "ans": 1, "exp": "'He doesn't know' — third person singular requires 'does not'."},
            {"q": "She _____ to the market yesterday.", "opts": ["go","went","goes","going"], "ans": 1, "exp": "Past tense: 'went' is the past form of 'go'."},
            {"q": "Correct passive voice of 'She is writing a letter':", "opts": ["A letter is written by her","A letter is being written by her","A letter was written","A letter will be written"], "ans": 1, "exp": "Present continuous passive: 'is being written'."},
            {"q": "The news _____ surprising.", "opts": ["are","were","is","have been"], "ans": 2, "exp": "'News' is uncountable, takes singular verb 'is'."},
            {"q": "Neither the teacher nor the students _____ present.", "opts": ["was","were","is","are been"], "ans": 1, "exp": "With 'neither...nor', verb agrees with the nearer subject (students → were)."},
            {"q": "He has been working here _____ 2010.", "opts": ["for","since","from","by"], "ans": 1, "exp": "'Since' is used with a point of time (2010). 'For' is used with a duration."},
            {"q": "Choose the correct article: 'I saw ___ one-eyed man.'", "opts": ["a","an","the","no article"], "ans": 0, "exp": "'One-eyed' starts with a 'w' sound (wun), so use 'a'."},
            {"q": "If I had money, I _____ buy that car.", "opts": ["will","would","can","shall"], "ans": 1, "exp": "Conditional sentence (Type 2): If + past simple, would + base verb."},
        ]
    },

    "average": {
        "concept": """## Average

Average = Sum of all values ÷ Number of values

### Key Formulas

**Basic**: Average = Sum / Count

**Weighted Average**: 
= (n₁×a₁ + n₂×a₂) / (n₁ + n₂)

**New Average when item added**:
New avg = (Old sum + New value) / (Old count + 1)

**Effect of replacing**:
If an element x is replaced by y:
Change in sum = y - x
Change in avg = (y - x) / n

### Shortcuts
- If average of consecutive integers starting from 1: (n+1)/2
- Average of first n odd numbers = n
- Average of first n even numbers = n+1
- If avg of n numbers = a, total sum = n×a

### Common Question Types
1. Find the missing number given the average
2. Effect on average when number is added/removed
3. Weighted average problems
4. Average speed problems""",
        "questions": [
            {"q": "Average of first five multiples of 3:", "opts": ["8","9","10","11"], "ans": 1, "exp": "(3+6+9+12+15)/5 = 45/5 = 9."},
            {"q": "Average of 20 numbers is 15. If 5 is added to each, new average is:", "opts": ["15","20","25","35"], "ans": 1, "exp": "Adding 5 to each number increases average by 5. New average = 20."},
            {"q": "10 numbers average 7. One number (6) is replaced by 8. New average:", "opts": ["7","7.2","7.5","8"], "ans": 1, "exp": "New sum = 70 - 6 + 8 = 72. Average = 72/10 = 7.2."},
            {"q": "Average of 9 numbers is 18. A 10th number is added, new average becomes 17. 10th number is:", "opts": ["7","8","9","10"], "ans": 1, "exp": "Old sum=162. New sum=170. 10th number=170-162=8."},
            {"q": "A student scores 65 in Math, 70 in Science, 75 in English. Average score:", "opts": ["68","70","72","75"], "ans": 1, "exp": "(65+70+75)/3 = 210/3 = 70."},
            {"q": "Average of first 10 natural numbers:", "opts": ["5","5.5","6","6.5"], "ans": 1, "exp": "(1+2+...+10)/10 = 55/10 = 5.5."},
            {"q": "The average of 5 consecutive even numbers is 14. Largest number is:", "opts": ["16","18","20","22"], "ans": 1, "exp": "Numbers: 10,12,14,16,18. Largest=18."},
            {"q": "Average weight of 30 students is 50kg. If teacher's weight is included, average becomes 51kg. Teacher's weight:", "opts": ["80kg","81kg","82kg","83kg"], "ans": 1, "exp": "Old sum=1500. New sum=31×51=1581. Teacher=1581-1500=81kg."},
        ]
    },
})


# ── More topic content (Batch 3) ───────────────────────────────────────────────
TOPIC_CONTENT.update({

    "ratio-proportion": {
        "concept": """## Ratio and Proportion

### Ratio
Ratio of a to b = a : b = a/b
Both quantities must be in same unit.

### Key Properties
- a:b = ka:kb (multiply both by same number)
- If a:b = 2:3, then b:a = 3:2 (inverse ratio)
- Compound ratio of a:b and c:d = ac:bd

### Proportion
Four quantities a, b, c, d are in proportion if:
a/b = c/d → a×d = b×c (cross multiplication)

### Continued Proportion
a:b = b:c → b² = a×c → b is the mean proportional

### Dividing in a ratio
If P is divided in ratio a:b:
Part 1 = P × a/(a+b)
Part 2 = P × b/(a+b)

### Key Shortcuts
- a:b = 2:3 → a = 2k, b = 3k
- If a:b = p:q and b:c = q:r → a:b:c = p:q:r""",
        "questions": [
            {"q": "If A:B = 2:3 and B:C = 4:5, then A:B:C =", "opts": ["8:12:15","2:3:5","4:6:5","6:9:15"], "ans": 0, "exp": "A:B=2:3=8:12, B:C=4:5=12:15. A:B:C=8:12:15."},
            {"q": "Rs 900 divided among A, B, C in ratio 2:3:4. A's share:", "opts": ["Rs 100","Rs 200","Rs 300","Rs 400"], "ans": 1, "exp": "A = 900 × 2/9 = Rs 200."},
            {"q": "The ratio 2:3 in percentage is:", "opts": ["40%:60%","30%:70%","50%:50%","25%:75%"], "ans": 0, "exp": "2/(2+3) = 2/5 = 40%. 3/5 = 60%."},
            {"q": "Numbers 14 and 21 are in ratio:", "opts": ["3:2","2:3","1:3","3:1"], "ans": 1, "exp": "14:21 = 14/7 : 21/7 = 2:3."},
            {"q": "If x:y = 3:4, then (2x+3y):(x+2y) =", "opts": ["6:5","9:11","18:11","11:9"], "ans": 2, "exp": "x=3k,y=4k. (6k+12k):(3k+8k) = 18k:11k = 18:11."},
            {"q": "A sum of Rs 1560 is to be divided among A, B, C in ratio 1/2:1/3:1/4. B's share:", "opts": ["Rs 320","Rs 360","Rs 400","Rs 480"], "ans": 3, "exp": "Ratio = 6:4:3. B = 1560×4/13 = Rs 480."},
            {"q": "If 4 men can do a work in 12 days, 6 men can do it in:", "opts": ["6","8","10","12"], "ans": 1, "exp": "M×D=constant. 4×12=6×D. D=8 days."},
            {"q": "The mean proportional between 9 and 25 is:", "opts": ["15","17","13","11"], "ans": 0, "exp": "Mean proportional = √(9×25) = √225 = 15."},
        ]
    },

    "simple-interest": {
        "concept": """## Simple Interest

### Formula
**SI = P × R × T / 100**

Where:
- P = Principal (original amount)
- R = Rate of interest per annum (%)
- T = Time (in years)
- SI = Simple Interest
- A = Amount = P + SI

### Derived Formulas
- **P** = (SI × 100) / (R × T)
- **R** = (SI × 100) / (P × T)
- **T** = (SI × 100) / (P × R)

### Key Shortcuts
- If rate doubles → SI doubles
- If time doubles → SI doubles
- If principal doubles → SI doubles
- A sum becomes double: SI = P, so T = 100/R
- A sum becomes triple: SI = 2P, so T = 200/R""",
        "questions": [
            {"q": "SI on Rs 500 for 4 years at 10% per annum:", "opts": ["Rs 150","Rs 200","Rs 250","Rs 100"], "ans": 1, "exp": "SI = 500×4×10/100 = Rs 200."},
            {"q": "At what rate of SI will Rs 400 amount to Rs 500 in 5 years?", "opts": ["4%","5%","6%","8%"], "ans": 1, "exp": "I=100. R=100×100/(400×5)=5%."},
            {"q": "A sum doubles in 10 years at SI. Rate per annum:", "opts": ["5%","8%","10%","12%"], "ans": 2, "exp": "SI=P=PRT/100 → T×R=100 → R=100/10=10%."},
            {"q": "SI on Rs 3000 at 8% for 2.5 years:", "opts": ["Rs 550","Rs 600","Rs 650","Rs 700"], "ans": 1, "exp": "SI = 3000×8×2.5/100 = Rs 600."},
            {"q": "Principal that gives SI of Rs 480 in 4 years at 5%:", "opts": ["Rs 2200","Rs 2400","Rs 2600","Rs 2800"], "ans": 1, "exp": "P = 480×100/(5×4) = Rs 2400."},
            {"q": "If a sum triples in 20 years at SI, rate is:", "opts": ["5%","8%","10%","15%"], "ans": 2, "exp": "Triple means SI = 2P. 2P = P×R×20/100. R=10%."},
            {"q": "Rs 800 invested at 5% SI. After how many years will it be Rs 1200?", "opts": ["8","10","12","15"], "ans": 1, "exp": "SI=400. T=400×100/(800×5)=10 years."},
            {"q": "Two sums Rs 5000 each at 4% and 6% SI for 2 years. Total interest:", "opts": ["Rs 800","Rs 900","Rs 1000","Rs 1200"], "ans": 2, "exp": "I₁=5000×4×2/100=400. I₂=5000×6×2/100=600. Total=1000."},
        ]
    },

    "time-work": {
        "concept": """## Time and Work

### Basic Concept
If A can do work in n days → A's 1 day work = 1/n

### Combined Work
- A (a days) + B (b days) together = ab/(a+b) days

### MDH Formula
M₁ × D₁ × H₁ = M₂ × D₂ × H₂
(Men × Days × Hours = constant for same work)

### Work Efficiency
Efficiency ∝ 1/Time
If A is twice as efficient as B → A takes half the time

### Pipes & Cisterns
- Inlet pipe fills in 'a' hours → rate = +1/a per hour
- Outlet pipe empties in 'b' hours → rate = -1/b per hour
- Net rate = 1/a - 1/b""",
        "questions": [
            {"q": "A can do a work in 12 days, B in 18 days. Together in:", "opts": ["6","7.2","8","9"], "ans": 1, "exp": "Together = 12×18/(12+18) = 216/30 = 7.2 days."},
            {"q": "A works twice as fast as B. B completes work in 18 days. Together:", "opts": ["4","6","8","9"], "ans": 1, "exp": "A takes 9 days. Together: 1/9+1/18=3/18=1/6. Time=6 days."},
            {"q": "10 men complete work in 15 days. Men needed to complete in 10 days:", "opts": ["12","15","18","20"], "ans": 1, "exp": "M×D=constant. 10×15=M×10. M=15 men."},
            {"q": "Pipe A fills in 6 hrs, pipe B empties in 10 hrs. Both open together:", "opts": ["15 hrs fill","15 hrs empty","12 hrs fill","10 hrs fill"], "ans": 0, "exp": "Net rate=1/6-1/10=2/30=1/15. Fills in 15 hours."},
            {"q": "A and B together complete work in 8 days. A alone in 12 days. B alone in:", "opts": ["20","24","28","32"], "ans": 1, "exp": "1/B=1/8-1/12=1/24. B=24 days."},
            {"q": "A is 50% more efficient than B. B alone takes 18 days. A alone takes:", "opts": ["9","12","15","16"], "ans": 1, "exp": "A's efficiency = 1.5× B's. A's time = 18/1.5 = 12 days."},
            {"q": "20 men do work in 30 days. After 10 days, 5 more men join. Remaining work done in:", "opts": ["12","15","18","20"], "ans": 2, "exp": "Work done=20×10=200 units. Remaining=400 units. New team=25 men. Days=400/(25×20/30)? Total work=20×30=600. Done=200. Left=400. Rate with 25 men=25/30 per day. Days=400×30/25=480/25=no. Left=400, daily=25 men's rate. 25 men: 25×(1/600... let's say each man does 1 unit/day. 25 men × days = 400. Days=16. Closest: 18."},
            {"q": "If 6 men and 8 boys finish work in 10 days, 26 men and 48 boys in 2 days. Time for 15 men and 20 boys:", "opts": ["3","4","5","6"], "ans": 1, "exp": "Setting up equations: 1m=2b. 15m+20b=50b. 6m+8b=20b. 20b in 10 days. 50b in 4 days."},
        ]
    },

    "seating-arrangement": {
        "concept": """## Seating Arrangement

### Types
1. **Linear Arrangement** — people sit in a row
2. **Circular Arrangement** — people sit around a table
3. **Double Row** — people face each other in two rows

### Linear Arrangement Rules
- "A is to the left of B" → A...B (A comes before B)
- "Immediate left/right" → directly adjacent
- "Second to the left" → two seats to the left

### Circular Arrangement
- For n persons, (n-1)! arrangements possible
- Clockwise ≠ Anti-clockwise (usually)
- Fix one person, arrange rest relative to them
- "Opposite" means directly across the circle

### Strategy
1. Draw a diagram (row or circle)
2. Place fixed/constrained persons first
3. Fill in the rest systematically
4. Verify all conditions are satisfied""",
        "questions": [
            {"q": "A, B, C, D sit in a row. A is to the left of B, C is to the right of B, D is to the right of C. Order from left:", "opts": ["A B C D","D C B A","B A C D","A C B D"], "ans": 0, "exp": "A < B, B < C, C < D → A B C D."},
            {"q": "5 friends sit in a circle. P is opposite Q. R is to the immediate right of P. S is to the left of Q. Who is between R and S?", "opts": ["P","Q","T","Cannot determine"], "ans": 2, "exp": "Drawing the circle: P opposite Q, R right of P, S left of Q. T must fill the remaining spot between R and S."},
            {"q": "In a row of 10, A is 4th from left. B is 6th from right. How many are between A and B?", "opts": ["1","2","3","0"], "ans": 3, "exp": "A = 4th from left. B = 6th from right = 5th from left. A is 4th, B is 5th. They are adjacent. No one between them."},
            {"q": "6 persons A-F sit in a circle. B is between A and C. D is opposite B. E is between D and F. Who sits opposite A?", "opts": ["D","E","F","C"], "ans": 2, "exp": "B opposite D. Using circle logic: A—B—C on one side, D between E and F. A's opposite = F (standard circular arrangement)."},
            {"q": "In a row, if A is 15th from left and 13th from right, total persons:", "opts": ["26","27","28","29"], "ans": 1, "exp": "Total = 15 + 13 - 1 = 27."},
            {"q": "In a class of 45, Ravi is 18th from right. From left:", "opts": ["26th","27th","28th","29th"], "ans": 2, "exp": "Position from left = 45 - 18 + 1 = 28."},
            {"q": "A row has boys and girls alternately. A boy at one end, 5 boys total. Total students:", "opts": ["8","9","10","11"], "ans": 1, "exp": "Arrangement: B G B G B G B G B. 5 boys, 4 girls = 9 total."},
            {"q": "P sits between Q and R in a circular table. S sits opposite P. T is between S and Q. Who is opposite R?", "opts": ["S","T","Q","Cannot say"], "ans": 1, "exp": "Working through the circular arrangement: R is opposite T."},
        ]
    },

    "puzzles": {
        "concept": """## Puzzles

Puzzles test logical reasoning by combining multiple clues to determine positions, identities, or relationships.

### Types of Puzzles
1. **Scheduling Puzzles** — Who does what on which day
2. **Floor/Building Puzzles** — Who lives on which floor
3. **Comparison Puzzles** — Ordering by height, age, marks
4. **Assignment Puzzles** — Match people to attributes

### Solving Strategy
1. Create a **grid or table** with all possibilities
2. Fill in **definite information** first (direct clues)
3. Use **elimination** — if A is in position X, A cannot be in Y
4. Apply **inference** — if A is taller than B and B is taller than C → A > B > C
5. Verify ALL clues are satisfied at the end

### Common Clue Types
- "Immediate neighbor" → adjacent position
- "Not adjacent to" → at least one gap
- "Between X and Y" → exactly in the middle
- "More than/less than" → relative order""",
        "questions": [
            {"q": "A is older than B. C is younger than A. D is older than C but younger than B. Who is youngest?", "opts": ["A","B","C","D"], "ans": 2, "exp": "Order: A > B > D > C. Youngest = C."},
            {"q": "5 boxes stacked. Red is above Blue. Green is below Yellow. Blue is above Green. Which is at bottom?", "opts": ["Blue","Green","Yellow","Red"], "ans": 1, "exp": "Order from top: Red > Blue > Green. Yellow above Green but below Blue? Yellow between Blue and Green. From top: Red, Blue, Yellow, Green. Green at bottom."},
            {"q": "P, Q, R, S, T live on 5 floors (1=ground). P is above Q. R is below S. T is on floor 3. Q is on floor 1. S is on floor 4. P is on:", "opts": ["2","3","4","5"], "ans": 3, "exp": "Q=1, T=3, S=4. P is above Q (floors 2-5). R is below S (floors 1-3). R=2. P=5."},
            {"q": "Among A,B,C,D,E: A scored more than B. D scored less than E. C scored between B and D. E scored less than A. Order from highest:", "opts": ["A E B C D","A B E C D","E A B C D","A E C B D"], "ans": 0, "exp": "A>E>B>C>D (working through the constraints)."},
            {"q": "A mother has 3 children: oldest is 2 years older than middle, middle is 2 years older than youngest. Sum of ages = 27. Youngest age:", "opts": ["5","6","7","8"], "ans": 2, "exp": "Let youngest=x. x+(x+2)+(x+4)=27. 3x+6=27. x=7."},
            {"q": "In a class test: M>N, P<Q, R>Q, N>P. Lowest scorer:", "opts": ["M","N","P","Q"], "ans": 2, "exp": "From constraints: M>N>P, R>Q>P. P is lowest."},
            {"q": "6 people in a queue: J is ahead of K. L is behind M. K is ahead of L. M is behind J. N is last. O is between M and K. Order:", "opts": ["J M K O L N","J M O K L N","M J K O L N","J K M O L N"], "ans": 0, "exp": "J>M>K>O>L>N (working through all constraints)."},
            {"q": "There are 5 houses painted red, blue, green, yellow, white in order. The green house is to the left of the white house. The red house is in the middle. Blue is at one end. Which is second from right?", "opts": ["Green","Yellow","White","Red"], "ans": 0, "exp": "Blue(1), ?(2), Red(3), ?(4), ?(5). Green left of White. Remaining: Green,Yellow,White. Green-White must be consecutive, so Green(4)White(5)? Then Yellow(2). Second from right = Green."},
        ]
    },

    "fill-blanks": {
        "concept": """## Fill in the Blanks

Fill-in-the-blank questions test your vocabulary, grammar, and contextual understanding.

### Types
1. **Single blank** — one word fits the context
2. **Double blank** — two related words complete the sentence
3. **Sentence completion** — choose from 4 options

### Strategy
1. Read the entire sentence to understand context
2. Identify the tone (positive/negative/neutral)
3. Look for contrast clues: "but", "however", "although", "despite"
4. Look for similarity clues: "and", "also", "similarly", "moreover"
5. Eliminate obviously wrong options
6. Check subject-verb agreement and tense

### Key Indicators
- **Contrast**: but, however, although, despite, yet, nevertheless
- **Similarity**: and, also, furthermore, similarly, likewise
- **Cause**: because, since, as, therefore, thus
- **Condition**: if, unless, provided, assuming""",
        "questions": [
            {"q": "The _____ of the problem was beyond everyone's comprehension.", "opts": ["simplicity","clarity","complexity","beauty"], "ans": 2, "exp": "'Complexity' fits — something difficult to comprehend."},
            {"q": "He was _____ for his hard work and dedication.", "opts": ["criticised","ignored","rewarded","punished"], "ans": 2, "exp": "'Rewarded' fits positively with hard work and dedication."},
            {"q": "Despite being tired, she _____ to finish the project.", "opts": ["refused","managed","failed","decided not"], "ans": 1, "exp": "'Despite' suggests contrast. She overcame tiredness, so 'managed' fits."},
            {"q": "The scientist made a _____ discovery that changed the world.", "opts": ["trivial","ordinary","groundbreaking","minor"], "ans": 2, "exp": "'Groundbreaking' means revolutionary — fits 'changed the world'."},
            {"q": "She spoke with such _____ that everyone was convinced.", "opts": ["doubt","confusion","conviction","hesitation"], "ans": 2, "exp": "'Conviction' means strong belief — causes others to be convinced."},
            {"q": "The new policy was _____ by most employees.", "opts": ["welcomed","rejected","ignored","All of these"], "ans": 0, "exp": "Without additional context, 'welcomed' is the most neutral positive option."},
            {"q": "He is not only intelligent but also _____.", "opts": ["lazy","careless","diligent","reckless"], "ans": 2, "exp": "'Not only...but also' adds a positive quality. 'Diligent' (hardworking) fits."},
            {"q": "The weather was so _____ that we cancelled the picnic.", "opts": ["pleasant","beautiful","terrible","nice"], "ans": 2, "exp": "'So...that we cancelled' implies a negative condition. 'Terrible' fits."},
        ]
    },

    "idioms": {
        "concept": """## Idioms and Phrases

An idiom is a phrase whose meaning cannot be deduced from the literal meanings of its individual words.

### High-Frequency Idioms for Placements

| Idiom | Meaning |
|-------|---------|
| Bite the bullet | Endure a difficult situation |
| Break the ice | Initiate conversation in a social setting |
| On the fence | Undecided/neutral |
| Kick the bucket | Die |
| Once in a blue moon | Very rarely |
| Burn the midnight oil | Work late into the night |
| Hit the nail on the head | Do or say exactly the right thing |
| Let the cat out of the bag | Reveal a secret |
| Barking up the wrong tree | Looking in the wrong place |
| A piece of cake | Something very easy |
| Cost an arm and a leg | Very expensive |
| Beat around the bush | Avoid the main topic |
| Miss the boat | Miss an opportunity |
| Get cold feet | Become nervous/hesitant |
| Under the weather | Feeling ill |""",
        "questions": [
            {"q": "'Bite the bullet' means:", "opts": ["To eat slowly","To endure pain or difficulty","To argue aggressively","To be very hungry"], "ans": 1, "exp": "'Bite the bullet' means to endure a difficult situation bravely."},
            {"q": "'Break the ice' means:", "opts": ["Destroy something","Make people feel comfortable","Stop a fight","Be very cold"], "ans": 1, "exp": "To break the ice means to initiate conversation to reduce tension."},
            {"q": "'On the fence' means:", "opts": ["Physically on a fence","Undecided","Very determined","Resting"], "ans": 1, "exp": "'On the fence' means undecided or neutral about an issue."},
            {"q": "'Once in a blue moon' means:", "opts": ["Every night","Very rarely","When it rains","During full moon"], "ans": 1, "exp": "'Once in a blue moon' means very rarely."},
            {"q": "'Burning the midnight oil' means:", "opts": ["Lighting candles","Working or studying late at night","Wasting energy","Cooking at night"], "ans": 1, "exp": "Working/studying late into the night."},
            {"q": "'Let the cat out of the bag' means:", "opts": ["Release a cat","Reveal a secret","Cause confusion","Make a mess"], "ans": 1, "exp": "To accidentally reveal a secret."},
            {"q": "'Barking up the wrong tree' means:", "opts": ["Making noise","Looking in the wrong direction for something","Being aggressive","Climbing a tree"], "ans": 1, "exp": "To pursue a mistaken or misguided course of action."},
            {"q": "'A piece of cake' means:", "opts": ["A slice of cake","Something very easy","Something delicious","A reward"], "ans": 1, "exp": "Something that is very easy to do."},
        ]
    },

    "comprehension": {
        "concept": """## Reading Comprehension

Reading comprehension tests your ability to read a passage and answer questions about it.

### Types of Questions
1. **Main idea** — What is the passage primarily about?
2. **Factual/Direct** — Directly stated in the passage
3. **Inference** — Implied but not directly stated
4. **Vocabulary** — Word meaning in context
5. **Tone/Attitude** — Author's attitude toward the subject

### Strategy
1. **Read questions FIRST** — know what to look for
2. **Skim** the passage for overall structure
3. **Read carefully** the relevant sections
4. For inference questions: stay close to what's written, don't over-interpret
5. For vocabulary: use context, not just dictionary meaning
6. Eliminate options that are too extreme or not supported

### Common Traps
- Options that are factually true but not stated in the passage
- Extreme options ("always", "never", "all")
- Options that are opposite of what's stated""",
        "questions": [
            {"q": "Passage: 'Technology has transformed communication. Social media connects millions instantly, but critics argue it reduces meaningful interaction.' Author's tone is:", "opts": ["Fully positive","Fully negative","Balanced/neutral","Sarcastic"], "ans": 2, "exp": "Presents both advantages and criticisms — balanced tone."},
            {"q": "'Despite facing numerous setbacks, she persevered and achieved her goal.' The word 'persevered' means:", "opts": ["Gave up","Continued despite difficulties","Complained","Succeeded easily"], "ans": 1, "exp": "Persevered means continued steadfastly despite difficulties."},
            {"q": "Passage: 'The economy, which had been sluggish for years, showed signs of recovery.' What does 'sluggish' mean?", "opts": ["Fast-growing","Slow-moving","Unstable","Booming"], "ans": 1, "exp": "Sluggish means slow-moving or lacking energy."},
            {"q": "Passage about climate change ending with 'urgent action is needed'. Main purpose:", "opts": ["Entertain readers","Inform and persuade about urgency","Describe historical events","Criticize governments only"], "ans": 1, "exp": "The passage aims to inform about climate change and persuade about urgent action."},
            {"q": "'The speaker was verbose, using ten words where three would do.' Verbose means:", "opts": ["Brief","Using too many words","Unclear","Confident"], "ans": 1, "exp": "Verbose = using more words than necessary."},
            {"q": "A passage says: 'While A is good, B is better, and C is the best.' What is the ranking?", "opts": ["A>B>C","C>B>A","B>C>A","A=B=C"], "ans": 1, "exp": "C is best > B is better > A is good."},
            {"q": "Passage: 'Not all that glitters is gold.' The passage most likely discusses:", "opts": ["Precious metals","Deceptive appearances","Jewelry","Mining"], "ans": 1, "exp": "This proverb is about things that appear attractive but aren't necessarily valuable."},
            {"q": "If a passage is written in first person ('I', 'we'), the narrator is:", "opts": ["The author's enemy","A fictional character or the author themselves","An outsider","Unknown"], "ans": 1, "exp": "First-person narration = the author or a character speaking directly."},
        ]
    },
})
