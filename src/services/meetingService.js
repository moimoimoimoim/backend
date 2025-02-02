// const timeslots = [];

function updateTimeslots(nickname, respondedSlots) {
  respondedSlots.forEach((slot) => {
    // 기존 timeslots에 slot이 존재하는지 확인
    let existingSlot = timeslots.find((t) => t.slot === slot);

    if (existingSlot) {
      // slot이 존재하면 members 배열에 nickname 추가
      if (!existingSlot.members.includes(nickname)) {
        existingSlot.members.push(nickname);
      }
    } else {
      // slot이 존재하지 않으면 새로 추가
      timeslots.push({ slot, members: [nickname] });
    }
  });

  // slot 기준 정렬 (순서 유지)
  timeslots.sort((a, b) => a.slot - b.slot);
}

// 테스트 실행
// updateTimeslots("user1", [46, 47, 48, 49, 50, 51]); // 월 23:00 ~ 화 02:00
// updateTimeslots("user2", [46, 47, 150, 151, 152, 153]); // 월 23:00 ~ 화 00:00, 목 03:00 ~ 05:00

// console.log(JSON.stringify(timeslots, null, 2));

const timeslots = [
  { slot: 46, members: ["user1", "user2"] },
  { slot: 47, members: ["user1", "user2"] },
  { slot: 48, members: ["user1"] },
  { slot: 49, members: ["user1"] },
  { slot: 50, members: ["user1"] },
  { slot: 51, members: ["user1"] },
  { slot: 150, members: ["user2"] },
  { slot: 151, members: ["user2"] },
  { slot: 152, members: ["user2"] },
  { slot: 153, members: ["user2"] },
];

function filterTimeSlots(minDuration, minMembers) {
  // 최소 인원 필터 적용
  let minMembersSlots = timeslots.filter((t) => t.members.length >= minMembers);

  if (minMembersSlots.length === 0) return [];
  minMembersSlots.sort((a, b) => a.slot - b.slot);

  // 연속된 slot 병합 및 최소 시간 필터 적용
  let resultSlots = [];
  let tmp = [minMembersSlots[0]];

  for (let i = 1; i < minMembersSlots.length; i++) {
    if (minMembersSlots[i].slot === minMembersSlots[i - 1].slot + 1) {
      tmp.push(minMembersSlots[i]);
    } else {
      if (tmp.length >= minDuration / 30) {
        resultSlots.push({ start: tmp[0].slot, end: tmp[tmp.length - 1].slot });
      }

      tmp = [minMembersSlots[i]];
    }
  }

  if (tmp.length >= minDuration / 30) {
    resultSlots.push({ start: tmp[0].slot, end: tmp[tmp.length - 1].slot });
  }

  return resultSlots;
}

console.log("최소 인원 2명:", filterTimeSlots(0, 2)); // 최소 인원 2명
console.log("최소 시간 60분:", filterTimeSlots(60, 0)); // 최소 60분 이상 지속
console.log("최소 인원 2명 & 최소 시간 60분:", filterTimeSlots(60, 2)); // 둘 다 적용
