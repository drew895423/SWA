Sends out a notification and send when a new ticket comes in.

To install:  
  - download zip at top right
  - unpack to a new folder, like c:\swa
  - open chrome
  - go to chrome://extensions
  - check developer mode in top right
  - Load Unpacked
  - Naigate into the SWA folder
  - click select folder

To use:
  - click the SWA extension in chrome when you're loaded into service desk
  - right click open space on the popup and click inspect
  - minimize the inspected window and it is all set
    > only needs inspect done to one window
    > opening new tabs needs a new inspect window to be opened
  - timer slider sets the amount of time to wait before refreshing all helpdesk.tn pages

To setup:
  - Click settings and type in your name, this will stop pop ups from happening from tickets in your que
    > A name has to be set to something to work correctly

Known:
  - Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.
    > chrome extension's window is not found or open
  - Opening a new tab wipes out your inspect window and stops the program from running

Todo:
  - Sound setting to change sounds
  - Phone update with new tickets for AFK tickets