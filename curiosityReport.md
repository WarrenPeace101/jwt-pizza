
# Warren's Curiosity Report
## Password Attacks 

In this class we discussed much about security. As part of the QA process, we should take every opportunity to make our system as secure as possible. This includes becoming familiar with many of the common attacks. I decided to take a deeper dive into password attacks and password security in general.

I started by researching some of the various types of password attacks. There are many forms of password attacks, each of which can be protected against with various measures.

1. **Brute Force Attack**

A hacker will spam-guess various passwords (sometimes those already compromised, or simply common passwords) in order to break into your system. This is also called "credential stuffing" when a hacker has already accessed one of your accounts and is looking to access your others. You can defend against this by avoiding the reusage of passwords, as well as avoiding simple passwords. You can also, depending on your system, allow for only a certain number of incorrect password attempts within a timeframe. As annoying as this is when you forget your password yourself, it will drastically safeguard against brute force attacks.

2. **Dictionary Attack**

Another form of brute force attack, hackers will often automate their software to guess dictionary words, and even sometimes collections of dictionary words. The safest way to overcome this is to use longer passwords, including combinations of words, numbers, and symbols. This will limit the chances of random dictionary guessing.

3. **Password Spray Attacks**

Hackers can collect large numbers of passwords and use them to attempt to crack an account. They can avoid triggering your maximum daily guesses by using the same pool over a longer time-span. In order to combat this type of large-scale attack (targetted at very important agencies, such as government systems for example), it is recommended that you change your vital passwords every so often (Norton suggests every 4 months).

4. **Social Engineering**

Hackers will often create false advertisements or websites designed to entice viewers into providing their credientials. Another term for this is "phishing". This way, the users directly provide the hackers access to their other accounts. To avoid this, be safe to avoid suspicious links and advertisements, and once again, avoid reusing passwords. 

5. **Traffic Interception**

Hackers can peer into certain network communications and view the requests being made. This is also known as a "man-in-the-middle attack". In order to avoid this, it's important to avoid insecure connections, such as public Wi-Fi. Also, using a VPN will add an extra layer of security by hashing your network requests. For this reason, a VPN is a good idea even if you believe your network is already secure.


These are just some of the attacking methods that hackers use. Norton does a great job at informing about the various types of password attacks and how to avoid falling for them.

https://us.norton.com/blog/emerging-threats/password-attack



## Other Good Password Tips

1.  **Use a password manager**

Password managers are better than recording your passwords manually as they

* avoid the risk of exposing your word document
* enforce good password practice techniques
* can automatically inject your password into a designated system

2. **Have sufficient complexity**

* At least 8 characters in length
* Use uppercase, lowercase, symbols, and numbers
* Use a passphrase that is not human readable

3. **Be aware of the risk of reusing passwords**

If one account does get hacked (which likely will happen at some point), reusing passwords makes your other accounts completely vulnerable. Reusing passwords, while convenient, isn't safe. Consider having different passwords for different applications, especially your most vulnerable assets.


## How I Could Have Improved JWT Pizza Security

1. **A password timeout system**

This was one method that I implemented in Deliverable #12. In order to prevent brute force attacks, I created a system that allowed for 5 password misguesses before preventing any more login attempts on a particular email. This prevented massive password guessing on any particular email account, which drastically reduced the risk of brute force attacks.

2. **Ensure that many names aren't reused**

Though much of the setup through AWS, we reused many credentials. For example, we named many things 'jwt-pizza'. While this isn't awful, it does run the risk of an intruder being able to guess the name of your services and might make it slightly easier to penetrate. For this reason, creating longer and more specific names could enhance AWS security.


## Conclusion

Password attacks have the capability to compromise your system, and are becoming increasingly dangerous with new hacking tools such as AI. As such, we have a great need to ensure that we are taking every precaution. While I have largely been lucky in the past in regards to having my data compromised, I know that everyone's luck eventually runs out. I love the scripture that says, "And now it came to pass that Moroni did not stop making preparations for war, or to defend his people against the Lamanites" (Alma 50:1). In this spirit, I'm grateful for the effective security measures that have been developed in the world of technology. Using the above tips, I hope that I will create secure systems to safeguard both my professional and personal life. 










https://www.beyondtrust.com/blog/entry/password-cracking-101-attacks-defenses-explained