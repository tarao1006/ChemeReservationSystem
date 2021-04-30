import random
from datetime import datetime
from datetime import timedelta


USER_IDS = [
    'professor001',
    'professor002',
    'professor003',
    'professor004',
    'student001',
    'student002',
    'student003',
    'student004',
]


def random_date(start: datetime, end: datetime):
    delta: timedelta = end - start
    random_second = random.randint(1, delta.days * 24 * 60 * 60)
    res = start + timedelta(seconds=random_second)
    return res.replace(second=0, hour=random.randint(7, 21), minute=random.randint(0, 3) * 15)


def random_user_ids(creator_id, k):
    user_ids = [creator_id]
    while len(user_ids) < k:
        user_id = random.randint(0, 7)
        if user_id not in user_ids:
            user_ids.append(user_id)
    return [USER_IDS[user_id] for user_id in user_ids]


def random_facility_ids(k):
    facility_ids = []
    while len(facility_ids) < k:
        facility_id = random.randint(1, 4)
        if facility_id not in facility_ids:
            facility_ids.append(facility_id)
    return facility_ids


def main(id, creator_id, start_at, end_at, plan_id, attendee_ids, facility_id):
    query = f"""
INSERT INTO `reservation` (`id`, `creator_id`, `start_at`, `end_at`, `plan_id`, `plan_memo`) VALUES ({id}, "{creator_id}", "{start_at}", "{end_at}", {plan_id}, "");"""

    for attendee_id in attendee_ids:
        query += f"""
INSERT INTO `reservation_user` (`reservation_id`, `user_id`) VALUES ({id}, "{attendee_id}");"""

    query += f"""
INSERT INTO `reservation_facility` (`reservation_id`, `facility_id`) VALUES ({id}, {facility_id});"""

    print(query)


if __name__ == "__main__":
    random.seed(1234)
    begin = datetime.strptime("2020-01-01", "%Y-%m-%d")
    end = datetime.strptime("2022-12-31", "%Y-%m-%d")

    plans = []
    for i in range(1500):
        start_at = random_date(begin, end)
        end_at = start_at + timedelta(hours=random.randint(1, 6))
        if start_at.day == end_at.day:
            plans.append((start_at, end_at))

    plans.sort(key=lambda x: x[0])

    valid_plans = []
    for plan in plans:
        valid = True
        for valid_plan in valid_plans:
            if plan[0] < valid_plan[1]:
                valid = False
                break
        if valid:
            valid_plans.append(plan)

    for i, valid_plan in enumerate(valid_plans):
        creator_id = random.randint(0, 7)
        main(
            i + 1,
            USER_IDS[creator_id],
            valid_plan[0],
            valid_plan[1],
            random.randint(1, 2),
            random_user_ids(creator_id, random.randint(0, 6)),
            random.randint(1, 4)
        )
