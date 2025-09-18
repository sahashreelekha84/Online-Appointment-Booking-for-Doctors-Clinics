
function generateSlots(startHour, startMinute, endHour, endMinute, duration) {
  const slots = [];
  let start = new Date(0, 0, 0, startHour, startMinute, 0);
  const end = new Date(0, 0, 0, endHour, endMinute, 0);

  while (start < end) {
    let endSlot = new Date(start.getTime() + duration * 60000);
    if (endSlot > end) break;

    const pad = n => (n < 10 ? '0' + n : n);

    slots.push(`${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(endSlot.getHours())}:${pad(endSlot.getMinutes())}`);
    start = endSlot;
  }

  return slots;
}

module.exports = generateSlots;
