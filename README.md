# CCTV Streaming Dashboard

This project is a CCTV streaming dashboard built with Next.js, React, and FFmpeg. It allows users to view live streams from multiple cameras, with features like mute/unmute, picture-in-picture, and fullscreen mode.

## Features

- **Live Streaming**: View live video streams from multiple cameras.
- **Mute/Unmute**: Control audio for each camera stream.
- **Picture-in-Picture**: Watch streams in a floating window.
- **Fullscreen Mode**: Expand streams to fullscreen.
- **Responsive Design**: Optimized for various screen sizes.

## Technologies Used

- **Next.js**: Framework for server-rendered React applications.
- **React**: JavaScript library for building user interfaces.
- **FFmpeg**: Tool for handling multimedia data.
- **HLS.js**: JavaScript library for playing HLS streams in browsers.
- **Tailwind CSS**: Utility-first CSS framework for styling.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- FFmpeg installed and accessible in your system's PATH.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/cctv-dashboard.git
   cd cctv-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add the following variables:
   ```plaintext
   CAMS_USERNAME=your_camera_username
   CAMS_PASSWORD=your_camera_password
   CAMERAS_IP=192.168.0.10,192.168.0.11,192.168.0.12
   ```

### Running the Application

- **Development Mode**:
  ```bash
  npm run dev
  ```

- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

## Usage

- Access the application at `http://localhost:3000`.
- Use the dashboard to view and control live streams from your cameras.

## Troubleshooting

- Ensure FFmpeg is correctly installed and accessible.
- Check network connectivity to the cameras.
- Verify that the environment variables are correctly set.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [FFmpeg](https://ffmpeg.org/)
- [HLS.js](https://github.com/video-dev/hls.js/)
- [Tailwind CSS](https://tailwindcss.com/)
# Home-CCTV-NVR
