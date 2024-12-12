# Penetration Testing Report

**Warren Mangum**
**Matthias Southwick**

#Self Attack
**Warren Mangum**

12/9/2024
Target: pizza.warrendeployment.click
Attack Type: Injection (not really, just database information exposure)
Severity: IV
Description: I noticed when trying to bypass various credentials (like skipping a password, etc.), that the database would return the stack frame in the response object. This is a vulnerability as it exposes information about your database to the outside world, making it easier to attack.



Corrections: I didn’t actually fix this problem in my code, as I believe that you would have to modify the Error class that StatusCodeError extends. But in general, you would fix this issue by sanitizing your error messages.


12/9/2024
Target: pizza.warrendeployment.click
Attack Type: Identification and Authentication Failure (Brute Force Attack)
Severity: III
Description: I noticed quickly that the login system of JWT Pizza is susceptible to brute force attacks. There is no system that monitors and prevents the spam-guessing of passwords for a given account. This means that someone doing a dictionary attack would probably succeed eventually.
