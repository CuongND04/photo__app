const formatDate = (dateString) => {
  const date = new Date(dateString); // Tạo đối tượng Date từ chuỗi ISO

  // Tên các tháng
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthName = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // chuyển 0h thành 12

  return `${monthName} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
};

export default formatDate;
