import './createPost.js';

import { Devvit, useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Bugsweeper Example',
  height: 'tall',
  render: (context) => {
    // Load username with `useAsync` hook
    const [username] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? 'anon';
    });

    // Create a reactive state for web view visibility and URL
    const [webviewVisible, setWebviewVisible] = useState(false);
    const [webviewUrl, setWebviewUrl] = useState('');
    
    // Create a state for menu visibility
    const [menuVisible, setMenuVisible] = useState(true);

    // When the web view invokes `window.parent.postMessage` this function is called
    const onMessage = async (msg: any) => {
      // If necessary, handle messages from the webview (though in this case, we don't need messages)
    };

    // When the button is clicked, send initial data to web view and show it
    const onShowWebviewClick = (page: string) => {
      setWebviewUrl(page);
      setMenuVisible(false); // Hide the menu when a game, leaderboard, or tutorial is shown
      setWebviewVisible(true);
    };

    // Function to go back to the menu
    const onBackToMenuClick = () => {
      setMenuVisible(true); // Show the menu again
      setWebviewVisible(false); // Hide the webview
    };

    // Render the custom post type
    return (
      <vstack grow padding="small" alignment="center">
        {/* Menu buttons */}
        {menuVisible && (
          <vstack
            grow={!webviewVisible}
            height={webviewVisible ? '0%' : '100%'}
            alignment="middle center"
          >
            <text size="xlarge" weight="bold">
              Bugsweeper Game
            </text>
            <button onPress={() => onShowWebviewClick('game.html')}>Start</button>
            <button onPress={() => onShowWebviewClick('leaderboard.html')}>LeaderBoard</button>
            <button onPress={() => onShowWebviewClick('tutorial.html')}>How to play?</button>
          </vstack>
        )}

        {/* Webview Container */}
        {webviewVisible && (
          <vstack border="thick" borderColor="black" height="100%" width="100%">
            <webview
              id="myWebView"
              url={webviewUrl}
              onMessage={(msg) => onMessage(msg)}
              grow
              height="100%"
            />
            {/* Back to Game button when the tutorial or other page is visible */}
            {webviewUrl === 'tutorial.html' && (
              <button onPress={onBackToMenuClick}>Back to Menu</button>
            )}
          </vstack>
        )}
      </vstack>
    );
  },
});

export default Devvit;
