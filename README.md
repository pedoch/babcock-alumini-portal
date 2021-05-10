## Welcome to the Babcock Alumini Portal

To run the app suceesfully you need to create a `.env.local` file in the root of the dierctory and add the following environment variables.

- `MONGODB_URI`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` - \*_Your own cloudinary upload preset on your account_

You'll also need to change the `CLOUD_NAME` variable in the `./util/cloud.js` file to _your own cloudinary cloud name on your account_

If you're using this app on you server you should add the environment variables to you server settings as well.

To run the app you will need `Node.JS` installed on your computer.

- If it is installed proceed to run `cd` into the project directory from you terminal.
- Then run the command `npm run dev`.
- When the app is done building copy the `http://localhost:3000/` URL and enter it in your browser to access the application.
