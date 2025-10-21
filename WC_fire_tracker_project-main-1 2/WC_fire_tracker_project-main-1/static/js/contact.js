document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("contactForm");
  const responseDiv = document.getElementById("response");

  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    // Front-end validation
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      responseDiv.innerHTML = "<p style='color:red;'>Please fill in all fields.</p>";
      return;
    }

    if (message.length < 10) {
      responseDiv.innerHTML = "<p style='color:red;'>Message must be at least 10 characters long.</p>";
      return;
    }

    // Send AJAX request
    const formData = new FormData(form);
    const response = await fetch("", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      responseDiv.innerHTML = `<p style="color:green;">${data.message}</p>`;
      form.reset();
    } else {
      const errorMessages = Object.values(data.errors)
        .flat()
        .map(err => `<p style="color:red;">${err}</p>`)
        .join("");
      responseDiv.innerHTML = errorMessages;
    }
  });
});
