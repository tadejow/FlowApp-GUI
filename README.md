# FlowApp - User Interface (GUI)

> An interactive educational application about river dynamics, hosted on [Cloudflare Pages](https://pages.cloudflare.com/).

This repository contains the source code for the FlowApp user interface. The application consists of a main shell written in React and a series of interactive "stations" (mini-games) that are embedded within `iframe`s.

**Live Application:** [https://flowapp-forked.pages.dev/](https://flowapp-forked.pages.dev/)

## 🚀 About The Project

FlowApp is a project designed to educate users about river ecosystems and fluid physics in an accessible and engaging way. Each station is a separate mini-game or simulation that illustrates a different phenomenon.

Key features:
*   **Station-based System:** A modular architecture with self-contained games.
*   **Multi-language Support:** The app supports English, Polish, German, and Czech.
*   **API Integration:** Selected games (`Duck Race`, `Reynolds Challenge`) save scores and display leaderboards by connecting to a backend running on Cloudflare Workers.

## 🛠️ Built With

*   **React:** The main application shell (written without JSX, using `React.createElement`).
*   **Cloudflare Pages:** Hosting and automated CI/CD.
*   **Vanilla JavaScript / TypeScript:** The logic for the individual games.
*   **Tailwind CSS:** Styling for some of the games (via CDN).

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18.x or later)
*   npm (usually installed with Node.js)

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/tadejow/FlowApp-GUI.git
    cd FlowApp-GUI
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

    > **Note:** To fully test the score saving and leaderboard features, you must also run the [FlowApp-API project](https://github.com/tadejow/FlowApp-API) locally.

## 🚀 Deployment

Deployment is fully automated thanks to the Cloudflare Pages integration.
*   A `push` to the `main` branch automatically triggers a deployment to the **production environment**.
*   A `push` to any other branch (e.g., `test`) creates a **preview deployment** with a unique URL, perfect for testing.

## 📁 File Structure

```
flowapp-page/
├── index.html          # Main HTML entry point
├── index.js            # Main React application code
├── package.json        # Dependencies and scripts
└── public/             # Static assets and individual games
    ├── duck-race-game/
    ├── river-flow-game/
    │   └── reynolds-experiment.html
    ├── falling-drop/
    └── ... (other games)
```

## 👥 Acknowledgements

TO DO.
