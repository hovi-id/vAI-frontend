# vAI Frontend

This project serves as a demonstration for a Verifiable AI Call Agent. In this demo, an AI sales agent initiates a call to the user. The mobile app verifies the AI agent's identity by leveraging verifiable credentials and DID-linked resources, ensuring that the user is interacting with a trusted and authenticated AI agent. This process establishes trust and authenticity in the interaction.

Additionally, the AI agent interacts with users over the call and verifies their identity in real-time by interacting with their digital wallet. This runtime verification uses verifiable credentials, further enhancing the security and reliability of the interaction.

This project showcases the potential of combining decentralized identity (DID) and verifiable credentials with AI to create secure, trustworthy, and innovative communication solutions.

This repository contains the frontend implementation for the [cheqd verfiable AI hackathon](https://dorahacks.io/hackathon/cheqd-verifiable-ai/) project.


## Try it
Experience Verfiable AI in action:  
👉 [Launch App](https://vai-hackathon-app.hovi.id)


## Technologies used

- [cheqd](https://cheqd.io)
- [Hovi](https://studio.hovi.id)
- [Bland.ai](https://bland.ai)


## Screenshots
<div style="display: flex; justify-content: space-around;">
    <img src="public/uploads/Screenshot_1.png" alt="Screenshot 1" style="width: 45%;"/>
    <img src="public/uploads/Screenshot_2.png" alt="Screenshot 2" style="width: 45%;"/>
</div>

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/hovi-id/vAI-frontend.git
    cd vAI-frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables:
    Create a `.env` file in the root directory and add the required variables. See env.sample

## Usage

Start the development server:
```bash
npm run dev
```

Run the production build:
```bash
npm start
```

## License

This project is licensed under the [MIT License](LICENSE).