# **App Name**: Rent Fairness

## Core Features:

- Room Input and Customization: Allow users to input room details: name, size, and features such as a private bathroom, closet, balcony, air conditioning, noise level, natural light and add custom features with an importance level.
- Weight Adjustment Panel: Enable users to adjust the weights (importance) of different factors, namely size, feature, and comfort via sliders to influence the rent split calculation. If users don't want to manually adjust weights, they may use the "Auto Optimize" tool.
- AI-Powered Weight Suggestions: Optionally, allow the use of the Google Gemini API as a tool to analyze the provided room data and suggest optimal weight distributions for size, features, and comfort to promote fairness. A Gemini API key should be entered in the Settings page. This key will only be stored locally.
- Fair Rent Calculation: Calculate the rent split for each roommate, applying the chosen weights to the room sizes, feature scores, and comfort scores based on provided formulas to come to a final split.
- Interactive Results Dashboard: Display a dashboard presenting the calculated rent split for each room, as well as visualizing the results in a pie chart. Also, display the 'fairness meter' to get an intuition of how fair is the result
- Download and Share: Allow users to download a summary of the rent split as a PDF. Additionally, allow users to generate shareable link.
- Live Counter: A live counter will show how many users were helped, incrementing after each PDF download or result share. The counters are stored in a simple Firestore database.

## Style Guidelines:

- Primary color: Soft blue (#A0CFEC) to evoke trust and harmony, fitting for financial calculations.
- Background color: Very light blue (#F0F8FF), close in hue to the primary color but heavily desaturated for a calming backdrop.
- Accent color: Muted lavender (#CDB4DE), analogous to blue but different enough in brightness and saturation to draw attention to key interactive elements.
- Font pairing: 'Poppins' (sans-serif) for headlines and short descriptive text, 'PT Sans' (sans-serif) for body text.
- Use consistent and simple icons to represent features like bathroom, closet, and balcony. Icons should be related to fairness and distribution, and avoid excessive visual clutter.
- A clean, step-by-step layout guiding users through the process: input, adjust weights, and results. Ensure a mobile-responsive design.
- Use subtle animations on the fairness meter. When generating results and providing suggestions use minimalist animation.