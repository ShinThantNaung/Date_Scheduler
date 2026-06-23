document.addEventListener("DOMContentLoaded", () => {
    const noButton = document.getElementById("no");
    const yesButton = document.getElementById("yes");
    const scheduleForm = document.getElementById("scheduleForm");
    const dateInput = document.getElementById("date");
    const timeInput = document.getElementById("time");

    let yesWidth = yesButton.offsetWidth;
    let yesHeight = yesButton.offsetHeight;
    let noWidth = noButton.offsetWidth;
    let noHeight = noButton.offsetHeight;

    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    dateInput.min = new Date(today - timezoneOffset).toISOString().split("T")[0];

    yesButton.addEventListener("click", () => {
        scheduleForm.classList.add("show");
        dateInput.focus();
    });

    noButton.addEventListener("click", () => {
        yesWidth += 25;
        yesHeight += 12;
        noWidth = Math.max(55, noWidth - 18);
        noHeight = Math.max(32, noHeight - 10);

        yesButton.style.width = `${yesWidth}px`;
        yesButton.style.height = `${yesHeight}px`;
        noButton.style.width = `${noWidth}px`;
        noButton.style.height = `${noHeight}px`;
    });

    scheduleForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const scheduledDate = dateInput.value;
        const scheduledTime = timeInput.value;
        const subject = "Valentine date schedule";
        const body = `Yes! Let's schedule our Valentine date for ${scheduledDate} at ${scheduledTime}.`;
        const mailToLink = `mailto:shinthantnaung112@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailToLink;
    });
});
