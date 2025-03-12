from collections import namedtuple, Counter
import random
import copy
import json
from prettytable import PrettyTable

# Constants
DEPTS = ['Computer Engineering', 'Information Technology', 'Mechanical Engineering',
         'Civil Engineering', 'Bio-medical Engineering']
DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
POP_SIZE = 100
GENERATIONS = 5000
NUM_SPECIFIC_SUBJECTS = 4
NUM_SPECIFIC_LABS = 2

# TimeSlot for lectures
TimeSlot = namedtuple('TimeSlot', ['day', 'slot'])
all_possible_slots = [TimeSlot(day, slot) for day in range(6) for slot in range(1, 7)]
possible_lab_slots = [(day, block) for day in range(6) for block in range(3)]

def get_lab_slots(day, block):
    """Convert lab (day, block) to two consecutive TimeSlots."""
    slot1 = 2 * block + 1
    slot2 = 2 * block + 2
    return [TimeSlot(day, slot1), TimeSlot(day, slot2)]

class Timetable:
    def __init__(self):
        self.common_subjects = {s: random.sample(all_possible_slots, 2) for s in range(1, 9)}
        self.specific_subjects = {(d, s, i): random.sample(all_possible_slots, 2)
                                  for d in range(5) for s in range(1, 9) for i in range(1, NUM_SPECIFIC_SUBJECTS + 1)}
        self.common_labs = {(d, s): random.choice(possible_lab_slots)
                            for d in range(5) for s in range(1, 9)}
        self.specific_labs = {(d, s, j): random.choice(possible_lab_slots)
                              for d in range(5) for s in range(1, 9) for j in range(1, NUM_SPECIFIC_LABS + 1)}

    def mutate(self):
        if random.random() < 0.1:
            s = random.choice(list(self.common_subjects.keys()))
            self.common_subjects[s] = random.sample(all_possible_slots, 2)
        for _ in range(NUM_SPECIFIC_SUBJECTS):
            key = random.choice(list(self.specific_subjects.keys()))
            self.specific_subjects[key] = random.sample(all_possible_slots, 2)
        for _ in range(2):
            key = random.choice(list(self.common_labs.keys()))
            self.common_labs[key] = random.choice(possible_lab_slots)
        for _ in range(NUM_SPECIFIC_LABS):
            key = random.choice(list(self.specific_labs.keys()))
            self.specific_labs[key] = random.choice(possible_lab_slots)

    def crossover(self, other):
        child = Timetable()
        for s in range(1, 9):
            child.common_subjects[s] = self.common_subjects[s] if random.random() < 0.5 else other.common_subjects[s]
        for key in self.specific_subjects:
            child.specific_subjects[key] = self.specific_subjects[key] if random.random() < 0.5 else other.specific_subjects[key]
        for key in self.common_labs:
            child.common_labs[key] = self.common_labs[key] if random.random() < 0.5 else other.common_labs[key]
        for key in self.specific_labs:
            child.specific_labs[key] = self.specific_labs[key] if random.random() < 0.5 else other.specific_labs[key]
        return child

    def to_dict(self):
        """Convert timetable to a dictionary for JSON serialization."""
        return {
            'common_subjects': {s: [(ts.day, ts.slot) for ts in slots] for s, slots in self.common_subjects.items()},
            'specific_subjects': {str(key): [(ts.day, ts.slot) for ts in slots] for key, slots in self.specific_subjects.items()},
            'common_labs': {str(key): list(lab_slot) for key, lab_slot in self.common_labs.items()},
            'specific_labs': {str(key): list(lab_slot) for key, lab_slot in self.specific_labs.items()}
        }

def evaluate(timetable):
    total_conflicts = 0
    for d in range(5):
        for s in range(1, 9):
            slots = []
            slots.extend(timetable.common_subjects[s])
            for i in range(1, NUM_SPECIFIC_SUBJECTS + 1):
                slots.extend(timetable.specific_subjects[(d, s, i)])
            lab_day, lab_block = timetable.common_labs[(d, s)]
            slots.extend(get_lab_slots(lab_day, lab_block))
            for j in range(1, NUM_SPECIFIC_LABS + 1):
                lab_day, lab_block = timetable.specific_labs[(d, s, j)]
                slots.extend(get_lab_slots(lab_day, lab_block))
            slot_counts = Counter(slots)
            conflicts = sum(count - 1 for count in slot_counts.values() if count > 1)
            total_conflicts += conflicts
    return total_conflicts

def run_genetic_algorithm():
    population = [Timetable() for _ in range(POP_SIZE)]
    for gen in range(GENERATIONS):
        fitness = [evaluate(timetable) for timetable in population]
        sorted_indices = sorted(range(len(population)), key=lambda i: fitness[i])
        sorted_population = [population[i] for i in sorted_indices]
        if fitness[sorted_indices[0]] == 0:
            break
        elite_size = int(POP_SIZE * 0.1)
        new_population = sorted_population[:elite_size]
        while len(new_population) < POP_SIZE:
            parent1 = random.choice(sorted_population[:POP_SIZE // 2])
            parent2 = random.choice(sorted_population[:POP_SIZE // 2])
            child = parent1.crossover(parent2)
            child.mutate()
            new_population.append(child)
        population = new_population
        if gen % 100 == 0:
            print(f"Generation {gen}, Best Fitness: {fitness[sorted_indices[0]]}")
    return sorted_population[0]

def display_timetable(timetable, dept_idx, sem):
    classes = []
    for ts in timetable.common_subjects[sem]:
        classes.append((ts, "Common Sub"))
    for i in range(1, NUM_SPECIFIC_SUBJECTS + 1):
        for ts in timetable.specific_subjects[(dept_idx, sem, i)]:
            classes.append((ts, f"Sub {i}"))
    lab_day, lab_block = timetable.common_labs[(dept_idx, sem)]
    for ts in get_lab_slots(lab_day, lab_block):
        classes.append((ts, "Common Lab"))
    for j in range(1, NUM_SPECIFIC_LABS + 1):
        lab_day, lab_block = timetable.specific_labs[(dept_idx, sem, j)]
        for ts in get_lab_slots(lab_day, lab_block):
            classes.append((ts, f"Lab {j}"))

    schedule = {}
    for ts, class_name in classes:
        if (ts.day, ts.slot) in schedule and schedule[(ts.day, ts.slot)] != class_name:
            schedule[(ts.day, ts.slot)] = "Conflict"
        else:
            schedule[(ts.day, ts.slot)] = class_name

    table = PrettyTable()
    table.field_names = ["Day", "8:00-9:00", "9:00-10:00", "10:00-10:30",
                         "10:30-11:30", "11:30-12:30", "12:30-1:00", "1:00-2:00", "2:00-3:00"]
    period_to_slot = {0: 1, 1: 2, 3: 3, 4: 4, 6: 5, 7: 6}
    for day in range(6):
        row = [DAYS[day]]
        for p in range(8):
            if p in [2, 5]:
                row.append("Break")
            else:
                slot = period_to_slot[p]
                class_name = schedule.get((day, slot), "")
                row.append(class_name)
        table.add_row(row)
    print(f"\nTimetable for {DEPTS[dept_idx]}, Semester {sem}:")
    print(table)
    return schedule  # Return schedule for storage

def save_timetable(timetable, filename="timetable.json"):
    """Save timetable to a JSON file."""
    timetable_dict = timetable.to_dict()
    with open(filename, 'w') as f:
        json.dump(timetable_dict, f, indent=4)
    print(f"Timetable saved to {filename}")

def main():
    while True:
        print("\nSelect department:")
        for i, dept in enumerate(DEPTS, 1):
            print(f"{i}. {dept}")
        choice = input("Enter number (1-5) or 'q' to quit: ")
        if choice.lower() == 'q':
            print("Exiting program.")
            return
        try:
            dept_idx = int(choice) - 1
            if dept_idx not in range(5):
                print("Please enter a number between 1 and 5.")
                continue
        except ValueError:
            print("Invalid input. Please enter a number or 'q'.")
            continue

        sem_input = input("Enter semester (1-8): ")
        try:
            sem = int(sem_input)
            if sem not in range(1, 9):
                print("Please enter a semester between 1 and 8.")
                continue
        except ValueError:
            print("Invalid input. Please enter a number.")
            continue
        break

    print("\nGenerating timetable with genetic algorithm... This may take a moment.")
    best_timetable = run_genetic_algorithm()
    final_fitness = evaluate(best_timetable)
    print(f"\nTimetable generated with {final_fitness} conflicts.")
    schedule = display_timetable(best_timetable, dept_idx, sem)
    save_timetable(best_timetable)

    while True:
        choice = input("\nWould you like to view another timetable? (y/n): ").lower()
        if choice != 'y':
            print("Exiting program.")
            break
        while True:
            print("\nSelect department:")
            for i, dept in enumerate(DEPTS, 1):
                print(f"{i}. {dept}")
            choice = input("Enter number (1-5) or 'q' to quit: ")
            if choice.lower() == 'q':
                print("Exiting program.")
                return
            try:
                dept_idx = int(choice) - 1
                if dept_idx not in range(5):
                    print("Please enter a number between 1 and 5.")
                    continue
            except ValueError:
                print("Invalid input. Please enter a number or 'q'.")
                continue

            sem_input = input("Enter semester (1-8): ")
            try:
                sem = int(sem_input)
                if sem not in range(1, 9):
                    print("Please enter a semester between 1 and 8.")
                    continue
            except ValueError:
                print("Invalid input. Please enter a number.")
                continue
            break
        display_timetable(best_timetable, dept_idx, sem)

if __name__ == "__main__":
    main()