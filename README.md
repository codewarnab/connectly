# Full-Stack Chat Application

This is a full-stack chat application built with Next.js 14, Convex, Supabase, Clerk, Pusher.js and LiveKit. It offers real-time messaging, video/audio calls, user authentication, and file storage capabilities.

## Features

- **Real-Time Messaging**: Send and receive messages instantly using Convex.
- **User Authentication**: Secure sign-up and login using Clerk.
- **File Uploads**: Upload and share images and PDFs, stored securely in Supabase.
- **Typing Indicators**: Show when users are typing with Pusher.js integration.
- **Video/Audio Calls**: Initiate high-quality calls using LiveKit.

## Technologies Used

- **Next.js**: For building the frontend.
- **Convex**: For backend logic and real-time communication.
- **Supabase**: For file storage.
- **Clerk**: For user authentication.
- **LiveKit**: For real-time video/audio calls.
- **Pusher.js**: For real-time typing indicators.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/codewarnab/connectly.git
   cd connectly
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables (see `.env.example`).

4. Run the application:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file:

```
CONVEX_DEPLOYMENT=your_convex_deployment
NEXT_PUBLIC_CONVEX_URL=your_public_convex_url
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
PUSHER_APP_ID=your_pusher_app_id
PUSHER_CLUSTER=your_pusher_cluster
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
NEXT_PUBLIC_LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
```

Refer to the `.env.example` file for a template of required keys.

## Additional Setup Guide

### Setting up Clerk Webhook

When setting up the webhook in Clerk, follow these steps:

1. Go to your Clerk Dashboard and navigate to the Webhooks section.
2. Create a new webhook.
3. Choose the "Convex" template when setting up the webhook.
4. Set the webhook path to `/api/clerk-auth-users-webhook`.
5. Ensure you select all the necessary events that your application needs to handle.
6. Copy the Signing Secret provided by Clerk and add it to your `.env.local` file as `CLERK_WEBHOOK_SECRET`.

### Convex Setup

To set up Convex:

1. Run the following command to start the Convex development server:
   ```bash
   npx convex dev
   ```
2. This command will provide you with the `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`. Add these to your `.env.local` file.

Remember to restart your application after adding or changing environment variables.

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Convex](https://www.convex.dev/)
- [Supabase](https://supabase.io/)
- [Clerk](https://clerk.dev/)
- [LiveKit](https://livekit.io/)
- [Pusher](https://pusher.com/)

## Contact

Your Name - [@codewarnab](https://twitter.com/codewarnab) - email@example.com

Project Link: [https://github.com/codewarnab/connectly](https://github.com/codewarnab/connectly)