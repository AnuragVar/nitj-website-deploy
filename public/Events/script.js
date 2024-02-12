const backendEndpoint = "https://example.com/api/events";
const maxEventsToShow = 3;
// Function to fetch events from the backend
// async function fetchEvents() {
//   try {
//     const response = await fetch(backendEndpoint);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     return [];
//   }
// }

async function fetchEvents() {
  try {
    const response = await fetch("dummy.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dummy events:", error);
    return [];
  }
}

// Function to format a date as "YYYY-MM-DD"
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function addEventsToHTML() {
  const events = await fetchEvents();
  //contains all the events by date

  const eventsByDate = {};
  //

  events.forEach((event) => {
    const formattedDate = formatDate(new Date(event?.date));
    //date is formatted
    if (!eventsByDate[formattedDate]) {
      eventsByDate[formattedDate] = [];
    }
    eventsByDate[formattedDate].push(event);
  });
  //now

  // Create HTML elements for each event
  for (const date in eventsByDate) {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate();
    const month = formattedDate.toLocaleString("default", { month: "short" });
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // to ignore time and compare only the date

    let eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0); // to ignore time and compare only the date

    let displayDate;
    if (currentDate.getTime() === eventDate.getTime()) {
      displayDate = "Today";
    } else {
      displayDate = `${day} ${month}`;
    }

    const list = document.createElement("li");
    const timelineContent = document.createElement("div");
    timelineContent.className = "timeline-content -ml-6 ";

    timelineContent.innerHTML = `
    <div class="h-4 w-4  rounded-full flex items-center justify-center " style="margin-left: -9.5px;  background-color: #D47400;border:"2px solid #6a4210"; "></div>      <div class="ml-6 " >
        <h3 class="text-lg font-semibold" style="margin-top: -25px; margin-bottom: 15px;">${displayDate} <span>${getDayOfWeek(
      new Date(date)
    )}</span></h3>
        <div class="flex flex-col ">
          ${eventsByDate[date].map((event) => createEventCard(event)).join("")}
        </div>
      </div>
    `;

    // timelineItem.appendChild(timelineContent);

    const timeline = document.querySelector(".timeline");
    timeline.appendChild(timelineItem);
  }
}

function createEventCard(event) {
  return `
  <div class=" card group mb-4 border border-dashed rounded-lg flex flex-col justify-between cursor-pointer hover:shadow-xl hover:border-slate-900 hover:border-4 transition dark:bg-slate-900 dark:shadow-slate-700/[.7]" 
  onclick="openModal('${
    event?.id
  }')">            <div class="bg-white border rounded-xl shadow-sm sm:flex dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7] flex flex-row justify-between hover:border-slate-900 hover:border-4">
                <div class="p-4 flex flex-col justify-between">
                    <div>
                    <div class="flex flex-row gap-3 " style="align-items: baseline;">
                    <div>
                                <p class="text-gray-300 dark:text-gray-400 mb-1" style="margin-top: -5px; font-size: 16; margin-bottom: 10px;">
                                    ${event?.time}
                                </p>
                            </div>
                            <div>
                            <span class="tag text-center text-lg me-2 px-3 py-1 rounded-full opacity-90 font-semibold" style="background-color:${getTagColor(
                              event?.tag
                            )}; margin-top:2.2px; font-size:13px ;   color: #FFFFFFB0;" >${
    event?.tag
  }</span>
                            </div>
                        </div>
                        <h3 class=" font-semibold text-slate-700 text-lg">
                            ${event?.name}
                        </h3>
                        <p class="mt-1 text-gray-400 dark:text-gray-700" style="font-size: 14;">
                            Organized by ${event?.organizer}
                        </p>
                    </div>
                    <div class="mt-3 flex flex-col gap-1">
                        <div class="flex flex-row mb-2 gap-1">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.05025 4.05025C7.78392 1.31658 12.2161 1.31658 14.9497 4.05025C17.6834 6.78392 17.6834 11.2161 14.9497 13.9497L10 18.8995L5.05025 13.9497C2.31658 11.2161 2.31658 6.78392 5.05025 4.05025ZM10 11C11.1046 11 12 10.1046 12 9C12 7.89543 11.1046 7 10 7C8.89543 7 8 7.89543 8 9C8 10.1046 8.89543 11 10 11Z" fill="#E58818" />
                            </svg>
                            <span style="vertical-align: middle; margin-bottom: 20; color:#4E4E4E;">${
                              event?.venue
                            }</span>
                        </div>
                        <div>
                            <div class="button-group flex-ror flex" style="gap: 15px;">
                            ${
                              event?.register
                                ? `<button type="button" data-te-ripple-init Button class="group flex flex-row gap-1 text-accent text-sm font-semibold bg-accent bg-opacity-50 hover:bg-accent hover:text-white hover:text-opacity-70 focus:outline-none focus:ring-4 focus:ring-offset-blue-950 rounded-lg text-center items-center justify-center align-middle px-2   text-nowrap transform transition duration-300 hover:scale-105 shadow-md py-0" style="border: 2px solid rgb(72, 139, 206);"
                            onclick="event?.stopPropagation(); window.open('${event?.register}', '_blank');">
                            <span class="material-symbols-outlined">
                            link
                            </span>
                                    Register
                                </button>`
                                : ""
                            }
                                ${
                                  event?.download
                                    ? `<button type="button" data-te-ripple-init Button class="group flex flex-row gap-1 text-accent text-sm font-semibold bg-accent bg-opacity-50 hover:bg-accent hover:text-white hover:text-opacity-70 focus:outline-none focus:ring-4 focus:ring-offset-blue-950 rounded-lg text-center items-center justify-center align-middle px-2   text-nowrap transform transition duration-300 hover:scale-105 shadow-md py-0" style="border: 2px solid rgb(72, 139, 206);"
                                onclick="event?.stopPropagation(); window.open('${event?.download}', '_blank');">
                                <span class="material-symbols-outlined">
download
</span>
                                    Download
                                </button>`
                                    : ""
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative overflow-hidden md:rounded-se-none p-2 ">
                    <img class="object-cover rounded-xl w-48 h-48 group-hover:scale-105 transition-transform duration-500 ease-in-out" src="${
                      event?.imageurl
                    }" alt="Image Description">
                </div>
            </div>
        </div>

        <div id="modal-${
          event?.id
        }" class="modal hidden fixed z-50 inset-0 w-full h-full overflow-auto" onclick="closeModal('${
    event?.id
  }')" style="  background-color: #000000C8;">
            <style> .modal-content{
              animation: slideRight 0.4s ease-in-out;
            }
            
            @keyframes slideRight {
              0% {
                transform: translateX(50%);
              }
              100% {
                transform: translateX(0);
              }
            }</style>
              <div class="modal-content m-auto mt-60 p-5 w-3/5 h-full fixed  left-1/2 transform translate-x-1/2 translate-y-1/2 bg-white bg-opacity-65 backdrop-blur-md rounded-l-lg border border-opacity-40 overflow-scroll"  onclick="event?.stopPropagation()">
            <!-- Close button -->
            <span class="close text-gray-500 float-right text-lg scale-150 font-bold w-5 h-5 pb-0.5 items-center justify-center flex rounded-full border border-gray-700 hover:text-black focus:text-white focus:outline-none cursor-pointer" onclick="closeModal('${
              event?.id
            }')">&times;</span>
        
            <!-- Modal content -->
            <div class="p-4 flex justify-center">
            <img class="object-cover" src="${
              event?.imageurl
            }" alt="Event Image" style="border-radius: 8px; height:300px;width:300px;">
            </div>
           
        <div class="flex flex-col gap-4 p-3">
        <div class="">
        <b><h2 style="margin-bottom: 15px; font-size: larger; color:"#000000"; ">${
          event?.name
        }</h2></b>
        
                            
        <span class="tag text-center text-lg me-2 px-3 py-1 rounded-full opacity-90 font-semibold" style="background-color:${getTagColor(
          event?.tag
        )}; margin-top:2.2px; font-size:13px ;   color: #FFFFFFB0;" >${
    event?.tag
  }</span>
       
        </div>
        <div style="font-size: medium; color: rgba(0, 0, 0, 0.681);">  <h2 style=" color:#1E1E1E;">${
          event?.venue
        }</h2>
        <br/>
        <h3> ${event?.time}  </h3>   <p>${event.description}</p>
        </div>
        </div>
            
            <!-- Example: Register and Download buttons -->
            <div style="margin-top: 20px;">
            <div class="button-group flex-row flex p-3" style="gap: 15px;">
            ${
              event?.register
                ? `<button type="button" data-te-ripple-init Button class="group flex flex-row gap-1 text-accent text-sm font-semibold bg-accent bg-opacity-50 hover:bg-accent hover:text-white hover:text-opacity-70 focus:outline-none focus:ring-4 focus:ring-offset-blue-950 rounded-lg text-center items-center justify-center align-middle px-2   text-nowrap transform transition duration-300 hover:scale-105 shadow-md py-0" style="border: 2px solid rgb(72, 139, 206);"
            onclick="event?.stopPropagation(); window.open('${event.register}', '_blank');">
            <span class="material-symbols-outlined">
            link
            </span>
                    Register
                </button>`
                : ""
            }
                ${
                  event?.download
                    ? `<button type="button" data-te-ripple-init Button class="group flex flex-row gap-1 text-accent text-sm font-semibold bg-accent bg-opacity-50 hover:bg-accent hover:text-white hover:text-opacity-70 focus:outline-none focus:ring-4 focus:ring-offset-blue-950 rounded-lg text-center items-center justify-center align-middle px-2   text-nowrap transform transition duration-300 hover:scale-105 shadow-md py-0" style="border: 2px solid rgb(72, 139, 206);"
                onclick="event?.stopPropagation(); window.open('${event.download}', '_blank');">
                <span class="material-symbols-outlined">
download
</span>
                    Download
                </button>`
                    : ""
                }
                
            </div>
        </div>      </div>
          </div>
        </div> 
    `;
}

function openModal(eventId) {
  const modal = document.getElementById(`modal-${eventId}`);
  modal.style.display = "block";
}

function closeModal(eventId) {
  const modal = document.getElementById(`modal-${eventId}`);
  modal.style.display = "none";
}

function openDialog(name, time, organizer, venue, imageUrl) {
  // You can implement your dialog box logic here
  alert(
    `Event Details:\nName: ${name}\nTime: ${time}\nOrganizer: ${organizer}\nVenue: ${venue}`
  );
}

function getDayOfWeek(date) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[date.getDay()];
}

function getTagColor(tagName) {
  switch (tagName) {
    case "Academic":
      return "#0284C7";
    case "Cultural":
      return "#9333EA";
    case "Fest":
      return "#E11D48";
    case "Sports":
      return "#3F6212";
    case "Club Event":
      return "#B45309";
    case "Training & Placement":
      return "#059669";
    default:
      return "#B45309";
  }
}
const getevents = `http://localhost:8000/api/eventsCalendar/events`;

async function fetchEvents() {
  try {
    const response = await fetch(getevents);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dummy events:", error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const materialIconElements = document.querySelectorAll(".material-arrow");
  materialIconElements.forEach((element) => {
    element.style.fontSize = "40px";
  });

  // const option1Button = document.getElementById("option1Button");
  // const option2Button = document.getElementById("option2Button");
  // const contentOption1 = document.getElementById("contentOption1");
  // const contentOption2 = document.getElementById("contentOption2");
  const monthlyViewButtons = document.getElementById("monthlyViewButtons");
  // By default, show content for Option 1
  // contentOption1.classList.remove("hidden");
  // contentOption2.classList.add("hidden");
  // upcomingEvents.classList.remove("hidden");
  // contentOption2.classList.add("hidden");

  // Event listener for Option 1 button
  // option1Button.addEventListener("click", function () {
  //   contentOption1.classList.remove("hidden");
  //   contentOption2.classList.add("hidden");
  //   upcomingEvents.classList.remove("hidden");
  //   monthlyViewButtons.style.justifyContent = "space-between";
  // });

  // Event listener for Option 2 button
  // option2Button.addEventListener("click", function () {
  //   contentOption1.classList.add("hidden");
  //   contentOption2.classList.remove("hidden");
  //   upcomingEvents.classList.add("hidden");
  //   monthlyViewButtons.style.justifyContent = "flex-end";
  //   monthlyViewButtons.style.justifyContent = "flex-end";
  // });

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const currentDate = document.querySelector(".current-date");
  const daysTag = document.querySelector(".days"),
    prevNextIcon = document.querySelectorAll(".icons span");

  let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();
  // currentMonth.innerHTML = currMonth;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function updateCurrentDate() {
    currentDate.innerText = `${months[currMonth]} ${currYear}`;
  }

  const renderCalendar = async () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay() - 1, // getting first day of month
      lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
      lastDayofMonth =
        new Date(currYear, currMonth, lastDateofMonth).getDay() - 1, // getting last day of month
      lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    // console.log(
    //   lastDateofLastMonth,
    //   lastDateofMonth,
    //   lastDayofMonth,
    //   firstDayofMonth
    // );
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
      // creating li of previous month last days
      liTag += `<button class=" relative bg-gray-100 px-3 py-2 text-gray-500 flex h-20 flex-col hover:bg-gray-100 focus:z-10">${
        lastDateofLastMonth - i + 1
      }</button>`;
    }

    const eventData = await fetchEvents();
    // const eventData = [
    //   {
    //     eventName: "Sample Event 1",
    //     startDateTime: "2024-02-09T14:00:00Z",
    //     endDateTime: "2024-02-11T02:00:00Z",
    //     organisingDept: "Computer Science",
    //     category: "academic",
    //     type: "online",
    //     venue: "Online",
    //     meetlink: "https://meet.google.com",
    //     description: "This is a sample event?.",
    //     studentCoordinator: {
    //       coordinator1: {
    //         phoneNumber: "1234567890",
    //         name: "Coordinator 1",
    //       },
    //       coordinator2: {
    //         phoneNumber: "0987654321",
    //         name: "Coordinator 2",
    //       },
    //     },
    //     facultyCoordinator: {
    //       name: "Faculty Coordinator",
    //       email: "faculty@university.edu",
    //     },
    //     socialMediaLinks: {
    //       whatsapp: "https://wa.me/1234567890",
    //       instagram: "https://instagram.com/sample",
    //       twitter: "https://twitter.com/sample",
    //     },
    //   },
    //   {
    //     eventName: "Sample Event 2",
    //     startDateTime: "2024-02-08T14:00:00Z",
    //     endDateTime: "2024-02-10T02:00:00Z",
    //     organisingDept: "Computer Science",
    //     category: "academic",
    //     type: "online",
    //     venue: "Online",
    //     meetlink: "https://meet.google.com",
    //     description: "This is a sample event?.",
    //     studentCoordinator: {
    //       coordinator1: {
    //         phoneNumber: "1234567890",
    //         name: "Coordinator 1",
    //       },
    //       coordinator2: {
    //         phoneNumber: "0987654321",
    //         name: "Coordinator 2",
    //       },
    //     },
    //     facultyCoordinator: {
    //       name: "Faculty Coordinator",
    //       email: "faculty@university.edu",
    //     },
    //     socialMediaLinks: {
    //       whatsapp: "https://wa.me/1234567890",
    //       instagram: "https://instagram.com/sample",
    //       twitter: "https://twitter.com/sample",
    //     },
    //   },
    //   {
    //     eventName: "Sample Event 3",
    //     startDateTime: "2024-02-08T14:00:00Z",
    //     endDateTime: "2024-02-10T02:00:00Z",
    //     organisingDept: "Computer Science",
    //     category: "academic",
    //     type: "online",
    //     venue: "Online",
    //     meetlink: "https://meet.google.com",
    //     description: "This is a sample event?.",
    //     studentCoordinator: {
    //       coordinator1: {
    //         phoneNumber: "1234567890",
    //         name: "Coordinator 1",
    //       },
    //       coordinator2: {
    //         phoneNumber: "0987654321",
    //         name: "Coordinator 2",
    //       },
    //     },
    //     facultyCoordinator: {
    //       name: "Faculty Coordinator",
    //       email: "faculty@university.edu",
    //     },
    //     socialMediaLinks: {
    //       whatsapp: "https://wa.me/1234567890",
    //       instagram: "https://instagram.com/sample",
    //       twitter: "https://twitter.com/sample",
    //     },
    //   },
    //   {
    //     eventName: "Sample Event 4",
    //     startDateTime: "2024-02-08T14:00:00Z",
    //     endDateTime: "2024-02-10T02:00:00Z",
    //     organisingDept: "Computer Science",
    //     category: "academic",
    //     type: "online",
    //     venue: "Online",
    //     meetlink: "https://meet.google.com",
    //     description: "This is a sample event?.",
    //     studentCoordinator: {
    //       coordinator1: {
    //         phoneNumber: "1234567890",
    //         name: "Coordinator 1",
    //       },
    //       coordinator2: {
    //         phoneNumber: "0987654321",
    //         name: "Coordinator 2",
    //       },
    //     },
    //     facultyCoordinator: {
    //       name: "Faculty Coordinator",
    //       email: "faculty@university.edu",
    //     },
    //     socialMediaLinks: {
    //       whatsapp: "https://wa.me/1234567890",
    //       instagram: "https://instagram.com/sample",
    //       twitter: "https://twitter.com/sample",
    //     },
    //   },
    //   {
    //     eventName: "Sample Event 5",
    //     startDateTime: "2024-02-08T14:00:00Z",
    //     endDateTime: "2024-02-10T02:00:00Z",
    //     organisingDept: "Computer Science",
    //     category: "academic",
    //     type: "online",
    //     venue: "Online",
    //     meetlink: "https://meet.google.com",
    //     description: "This is a sample event?.",
    //     studentCoordinator: {
    //       coordinator1: {
    //         phoneNumber: "1234567890",
    //         name: "Coordinator 1",
    //       },
    //       coordinator2: {
    //         phoneNumber: "0987654321",
    //         name: "Coordinator 2",
    //       },
    //     },
    //     facultyCoordinator: {
    //       name: "Faculty Coordinator",
    //       email: "faculty@university.edu",
    //     },
    //     socialMediaLinks: {
    //       whatsapp: "https://wa.me/1234567890",
    //       instagram: "https://instagram.com/sample",
    //       twitter: "https://twitter.com/sample",
    //     },
    //   },
    //   {
    //     eventName: "Sample Event 5",
    //     startDateTime: "2024-02-08T14:00:00Z",
    //     endDateTime: "2024-02-10T02:00:00Z",
    //     organisingDept: "Computer Science",
    //     category: "academic",
    //     type: "online",
    //     venue: "Online",
    //     meetlink: "https://meet.google.com",
    //     description: "This is a sample event?.",
    //     studentCoordinator: {
    //       coordinator1: {
    //         phoneNumber: "1234567890",
    //         name: "Coordinator 1",
    //       },
    //       coordinator2: {
    //         phoneNumber: "0987654321",
    //         name: "Coordinator 2",
    //       },
    //     },
    //     facultyCoordinator: {
    //       name: "Faculty Coordinator",
    //       email: "faculty@university.edu",
    //     },
    //     socialMediaLinks: {
    //       whatsapp: "https://wa.me/1234567890",
    //       instagram: "https://instagram.com/sample",
    //       twitter: "https://twitter.com/sample",
    //     },
    //   },
    //   {
    //     eventName: "Sample Event 5",
    //     startDateTime: "2024-02-08T14:00:00Z",
    //     endDateTime: "2024-02-10T02:00:00Z",
    //     organisingDept: "Computer Science",
    //     category: "academic",
    //     type: "online",
    //     venue: "Online",
    //     meetlink: "https://meet.google.com",
    //     description: "This is a sample event?.",
    //     studentCoordinator: {
    //       coordinator1: {
    //         phoneNumber: "1234567890",
    //         name: "Coordinator 1",
    //       },
    //       coordinator2: {
    //         phoneNumber: "0987654321",
    //         name: "Coordinator 2",
    //       },
    //     },
    //     facultyCoordinator: {
    //       name: "Faculty Coordinator",
    //       email: "faculty@university.edu",
    //     },
    //     socialMediaLinks: {
    //       whatsapp: "https://wa.me/1234567890",
    //       instagram: "https://instagram.com/sample",
    //       twitter: "https://twitter.com/sample",
    //     },
    //   },
    //   {
    //     eventName: "Sample Event 5",
    //     startDateTime: "2024-02-08T14:00:00Z",
    //     endDateTime: "2024-02-10T02:00:00Z",
    //     organisingDept: "Computer Science",
    //     category: "academic",
    //     type: "online",
    //     venue: "Online",
    //     meetlink: "https://meet.google.com",
    //     description: "This is a sample event?.",
    //     studentCoordinator: {
    //       coordinator1: {
    //         phoneNumber: "1234567890",
    //         name: "Coordinator 1",
    //       },
    //       coordinator2: {
    //         phoneNumber: "0987654321",
    //         name: "Coordinator 2",
    //       },
    //     },
    //     facultyCoordinator: {
    //       name: "Faculty Coordinator",
    //       email: "faculty@university.edu",
    //     },
    //     socialMediaLinks: {
    //       whatsapp: "https://wa.me/1234567890",
    //       instagram: "https://instagram.com/sample",
    //       twitter: "https://twitter.com/sample",
    //     },
    //   },
    //   {
    //     eventName: "Sample Event 5",
    //     startDateTime: "2024-02-08T14:00:00Z",
    //     endDateTime: "2024-02-10T02:00:00Z",
    //     organisingDept: "Computer Science",
    //     category: "academic",
    //     type: "online",
    //     venue: "Online",
    //     meetlink: "https://meet.google.com",
    //     description: "This is a sample event?.",
    //     studentCoordinator: {
    //       coordinator1: {
    //         phoneNumber: "1234567890",
    //         name: "Coordinator 1",
    //       },
    //       coordinator2: {
    //         phoneNumber: "0987654321",
    //         name: "Coordinator 2",
    //       },
    //     },
    //     facultyCoordinator: {
    //       name: "Faculty Coordinator",
    //       email: "faculty@university.edu",
    //     },
    //     socialMediaLinks: {
    //       whatsapp: "https://wa.me/1234567890",
    //       instagram: "https://instagram.com/sample",
    //       twitter: "https://twitter.com/sample",
    //     },
    //   },
    // ];
    // console.log(eventData);
    // Create an object to store events for each day
    const eventsByDay = {};

    const currentDate = new Date(currYear, currMonth, 1);

    eventData.forEach((event) => {
      const eventDate = new Date(event?.startDateTime);
      // console.log(eventDate);
      const day = eventDate.getDate();
      // console.log(day);

      if (
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      ) {
        if (!eventsByDay[day]) {
          eventsByDay[day] = [];
        }
        eventsByDay[day].push(event);
      }
    });

    // console.log(eventsByDay);

    for (let i = 1; i <= lastDateofMonth; i++) {
      // creating li of all days of current month
      // adding active class to li if the current day, month, and year matched
      const events = eventsByDay[i] || [];
      let isToday =
        i === date.getDate() &&
        currMonth === new Date().getMonth() &&
        currYear === new Date().getFullYear()
          ? "bg-amber-700"
          : "";
      liTag += `<button class="relative flex h-20 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10 ${isToday}">${i}`;

      if (events.length > 0) {
        events.forEach((event, index) => {
          if (index < maxEventsToShow || (index == 3 && events.length == 4)) {
            console.log(index);
            liTag += `<div class="text-xs text-gray-500 text-left font-semibold truncate  hover:text-accent" onclick="openModal('${
              event?._id
            }')" >${event?.eventName}</div>

          <div id="modal-${
            event?._id
          }" class="modal hidden fixed z-50 inset-0 w-full h-full overflow-auto" onclick="closeModal('${
              event?._id
            }')" style="  background-color: #000000C8;">
            <style>
                .modal-content {
                    animation: slideRight 0.4s ease-in-out;
                }
        
                @keyframes slideRight {
                    0% {
                        transform: translateX(50%);
                    }
        
                    100% {
                        transform: translateX(0);
                    }
                }
            </style>
            <div class="modal-content m-auto mt-60 p-5 w-3/5  h-full fixed  left-1/2 transform translate-x-1/2 translate-y-1/2 bg-white bg-opacity-65 backdrop-blur-md rounded-l-lg border border-opacity-40 overflow-scroll" 
                onclick="event?.stopPropagation()">
                <!-- Close button -->
                <span
                    class="close text-gray-500 float-left text-lg scale-200 font-bold w-5 h-5 pb-1 items-center justify-center flex rounded-full border border-gray-700 hover:text-black focus:text-white focus:outline-none cursor-pointer"
                    onclick="closeModal('${event?._id}')">&times;</span>
        
                <!-- Modal content -->
                <div class="p-4 flex justify-center" style="min-width:47vw">
                    <img class="object-cover" src="${
                      event?.posterUrl
                    }" alt="Event Image" style="border-radius: 8px; height:300px;width:300px;">
                </div>
        
                <div class="flex flex-col gap-4 p-3 ">
                    <div class="">
        
                        <b>
                            <h2 style="margin-bottom: 15px; font-size: larger; color:" #000000"; ">${
                              event?.eventName
                            }</h2></b>
                
               
                <span class=" tag uppercase text-center text-lg me-2 px-3 py-1 rounded-full opacity-90 font-semibold"
                                style="background-color:${getTagColor(
                                  event?.category
                                )}; margin-top:2.2px; font-size:13px ;   color: #FFFFFFB0;">
                                ${event?.category}</span>
        
                    </div>
                    <div style="font-size: medium; color: rgba(0, 0, 0, 0.681);">
                        <div class="flex flex-row space-between justify-between items-baseline">
        
                            <h2 class="font-semibold text-lg" style=" color:#1E1E1E;">${
                              event?.venue
                            }</h2>
                            <h3 class=" font-semibold text-accent-orange text-lg"> Organizer : ${
                              event?.organisingDept
                            }</h3>
                        </div>
        
                        <br />
                        
                        <p>${event?.description}</p>
                    </div>
                </div>
        
                <div style="margin-top: 20px;"> 
                    <div class="info flex-row flex p-3" style="gap: 15px;">
                        ${
                          event?.meetlink
                            ? `<button type="button" data-te-ripple-init Button
                            class="group flex flex-row gap-1 text-accent text-sm font-semibold bg-accent bg-opacity-50 hover:bg-accent hover:text-white hover:text-opacity-70 focus:outline-none focus:ring-4 focus:ring-offset-blue-950 rounded-lg text-center items-center justify-center align-middle px-2   text-nowrap transform transition duration-300 hover:scale-105 shadow-md py-0"
                            style="border: 2px solid rgb(72, 139, 206);" onclick="event?.stopPropagation(); window.open('${event?.meetlink}', '_blank');">
                            <span class="material-symbols-outlined">
                                link
                            </span>
                            Link
                        </button>`
                            : ""
                        }
                        ${
                          event?.download
                            ? `<button type="button" data-te-ripple-init Button
                            class="group flex flex-row gap-1 text-accent text-sm font-semibold bg-accent bg-opacity-50 hover:bg-accent hover:text-white hover:text-opacity-70 focus:outline-none focus:ring-4 focus:ring-offset-blue-950 rounded-lg text-center items-center justify-center align-middle px-2   text-nowrap transform transition duration-300 hover:scale-105 shadow-md py-0"
                            style="border: 2px solid rgb(72, 139, 206);" onclick="event?.stopPropagation(); window.open('${event?.download}', '_blank');">
                            <span class="material-symbols-outlined">
                                download
                            </span>
                            Download
                        </button>`
                            : ""
                        }
                        
                    </div>
                    <div class="flex flex-col p-3 gap-3">
                        ${Object.entries(event)
                          .map(([key, value]) => {
                            if (
                              ![
                                "_id",
                                "eventName",
                                "startDateTime",
                                "endDateTime",
                                "organisingDept",
                                "category",
                                "venue",
                                "type",
                                "meetlink",
                                "description",
                                "department",
                                "posterUrl",
                              ].includes(key)
                            ) {
                              if (typeof value === "object") {
                                return `
                                <div class="flex flex-col gap-2">
                                  <p><b>${key} :</b></p>
                                  <div class="flex flex-col gap-1">
                                    ${Object.entries(value)
                                      .map(([subKey, subValue]) => {
                                        if (typeof subValue === "object") {
                                          return `
                                          <p><b>${subKey} :</b></p>
                                          <div>
                                            ${Object.entries(subValue)
                                              .map(
                                                ([subSubKey, subSubValue]) => {
                                                  if (
                                                    typeof subSubValue ===
                                                      "string" &&
                                                    subSubValue.startsWith(
                                                      "http"
                                                    )
                                                  ) {
                                                    return `
                                                  <div>
                                                    <p><b>${subSubKey} :</b> <a href="${subSubValue}" target="_blank">${subSubValue}</a></p>
                                                  </div>
                                                `;
                                                  } else {
                                                    return `
                                                  <div>
                                                    <p><b>${subSubKey} :</b> ${subSubValue}</p>
                                                  </div>
                                                `;
                                                  }
                                                }
                                              )
                                              .join("")}
                                          </div>
                                        `;
                                        } else {
                                          if (
                                            typeof subValue === "string" &&
                                            subValue.startsWith("http")
                                          ) {
                                            return `<p><b>${subKey} :</b> <a href="${subValue}" target="_blank">${subValue}</a></p>`;
                                          } else {
                                            return `<p><b>${subKey} :</b> ${subValue}</p>`;
                                          }
                                        }
                                      })
                                      .join("")}
                                  </div>
                                </div>
                              `;
                              } else {
                                if (
                                  typeof value === "string" &&
                                  value.startsWith("http")
                                ) {
                                  return `<p>${key} : <a href="${value}" target="_blank">${value}</a></p>`;
                                } else {
                                  return `<p>${key} : ${value}</p>`;
                                }
                              }
                            }
                          })
                          .join("")}
                              
                        </div>
                </div>
            </div>
        </div>
        </div>
          `;
          } else if (index === maxEventsToShow) {
            console.log(index, "ii");
            // Display a message when the maximum number of events is reached
            liTag += `<div class="text-xs text-accent-orange text-left hover:text-accent cursor-pointer font-bold">+ ${
              events.length - maxEventsToShow
            } more events</div>`;
          }
        });
      }

      // liTag += `</button>`;
    }
    const remainingDays = 35 - (firstDayofMonth + lastDateofMonth);
    if (remainingDays > 0)
      for (let i = 1; i <= remainingDays; i++) {
        // creating li of next month first days
        liTag += `<button class=" relative bg-gray-100 flex h-20 flex-col  px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10">${i}</button>`;
      }
    updateCurrentDate(); // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
  };
  renderCalendar();

  prevNextIcon.forEach((icon) => {
    // getting prev and next icons
    icon.addEventListener("click", () => {
      // adding click event on both icons
      // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
      currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

      if (currMonth < 0 || currMonth > 11) {
        // if current month is less than 0 or greater than 11
        // creating a new date of current year & month and pass it as date value
        date = new Date(currYear, currMonth, new Date().getDate());
        currYear = date.getFullYear(); // updating current year with new date year
        currMonth = date.getMonth(); // updating current month with new date month
      } else {
        date = new Date(); // pass the current date as date value
      }

      renderCalendar(); // calling renderCalendar function
    });
  });

  const tabs = document.querySelectorAll("[data-tab-target]");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.tabTarget;
      const targetContent = document.getElementById(targetId);

      // Hide all tab contents
      tabContents.forEach((content) => {
        content.style.display = "none";
      });

      // Show the selected tab content
      targetContent.style.display = "block";

      // Remove 'active' class from all tabs
      tabs.forEach((t) => {
        t.classList.remove("active");
      });

      // Add 'active' class to the clicked tab
      tab.classList.add("active");
    });
  });

  //buttons code
  //   const tabs = document.querySelectorAll(".tab_btn");
  //   const all_content = document.querySelectorAll(".content");

  //   tabs.forEach((tab, index) => {
  //     tab.addEventListener("click", (e) => {
  //       tabs.forEach((tab) => {
  //         tab.classList.remove("active");
  //       });
  //       tab.classList.add("active");
  //     });
  //   });
});

// function showEventModal(eventId) {
//   // Assuming you have a modal HTML template as a string
//   const modalHtml = `<div id="modal-${eventId}" class="modal hidden fixed z-50 inset-0 w-full h-full overflow-auto" onclick="closeModal('${eventId}')" style="  background-color: #000000C8;">
//       <!-- (Your existing modal HTML) -->
//   </div>`;

//   // Create a temporary div and set its innerHTML to the modal HTML
//   const tempDiv = document.createElement("div");
//   tempDiv.innerHTML = modalHtml;

//   // Append the modal to the body
//   document.body.appendChild(tempDiv.firstChild);

//   // Show the modal
//   const modal = document.getElementById(`modal-${eventId}`);
//   modal.style.display = "block";
// }

// // Add the closeModal function
// function closeModal(eventId) {
//   const modal = document.getElementById(`modal-${eventId}`);
//   modal.style.display = "none";
//   // Remove the modal element from the DOM when closed
//   modal.remove();
// }
window.onload = addEventsToHTML;
