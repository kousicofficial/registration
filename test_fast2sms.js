

async function testFast2SMS() {
  const payload = {
    route: "q",
    message: "Your OTP is 123456",
    numbers: "9999999999"
  };

  const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      "authorization": "AsvPon7yVcfuHq8EwzDLrMW2O6i3XG1edlRgYxaS0pF5Z49NQBI2Tmuv7aZtNh6iefrlPLwXQJn58EjK",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  console.log(data);
}

testFast2SMS();
