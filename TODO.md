# Features to implement

* Return error code if the message failed to send
* Display the sent message message and the result of it for each attempted send
* Remove the text 'Message sent - ' from the success response i.e. only display
  the message
* Add a way to resend a previously sent message, maybe a button on the message
  row that fills in the message box
* Allow sending of a configurable number of messages
* Allow selection of queue from those available (rather than free text
  entering)
* Save a profile for the message and queue
* Pretty print the message when displayed and set the text area to the correct
  number of rows
* Improve number of messages being sent presentation

## Implemented features

* Persist form values between server restarts
* Display the id the message was sent with
* Append each message send result to a list rather than overwriting it
