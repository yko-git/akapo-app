// app/page.tsx
import React from "react";

const HomePage = () => {
  return (
    <main style={styles.main}>
      <h1 style={styles.heading}>Welcome to My App</h1>
      <p style={styles.description}>
        This is the initial page of your application!
      </p>
    </main>
  );
};

// CSS-in-JSのスタイル
const styles = {
  main: {
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "3rem",
    color: "#333",
  },
  description: {
    fontSize: "1.5rem",
    color: "#666",
  },
};

export default HomePage;
