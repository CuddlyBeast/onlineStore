# onlineStore

___

![Store Model](./public/img/hero4.png "High Fashion")
> The joy of dressing is an art.
-John Galliano

## Project Description 

This project was inspired by the ASOS website which I regularly frequent for convenient cloth shopping. This project is my second independent creation after the making of the table service application "Glutton for Grub". Therefore, the inital aim of the project was to identify a similar concept involving users purchasing products so that I could improve on the strucuture, flow and presentation of the application. The e-commerce website "Cara" creates an efficient and smooth experience when purchasing clothes. The filters and pagination allow users to find products of interest. Relevant information regarding the products are clearly presented such as the name, price, and brand. Each product has multiple options for size and is visible from multiple angles so the user can gain a better perspective of the clothing. The hover cart when browsing allows for users to view and remove items for convenience. While, the cart page presents the information in greater detail providing a cart total and the ability to reduce the cost with a discount coupon. It is required that a user is logged in before entering into the checkout page. Once all the payment and billing information is given the user can confirm their purchase of the cart items. The user can then view their orders in the order history page where they are given a 5 minute grace period to retract their purchase before it is magically delivered. If the user would like to get in contact with Cara's Human Resources team (me) the contact page contains a working form.       

#### The Technologies Used: 
- Node.js and the Express.js framework
- Bcrypt and Json Web Token for encryption/authorisation
- Helmet, Express-session and CORS for added security
- Swagger: API Documentation

## How to Use the Project

*Use node/nodemon server.js in the terminal to start the server*

1. http://localhost:3000/cuddy/signup - post route for creating a profile.
    1. Requires a username as well as a unique mobile, email and password.
    2. The password must be at least 8 characters long including lowercase, uppercase, and numeric values.
2. http://localhost:3000/cuddy/signin - post route to sign-in to a specific profile.
    1. Upon successful sign-in the user will be authenticated obtaining a JWT token.
3. http://localhost:3000/cuddy/products - get route to display the products.
    1. The information from this route is sculpted in different ways to present the user with specific products
4. http://localhost:3000/cuddy/products/:productId - get route that loads the specific item the user has selected.
    1. After the user has clicked a product the single product page will load and the selected item will appear through the use of its id. 
5. http://localhost:3000/cuddy/verifyToken - post route that checks if the user is logged in to inform functions which action they should take.
    1. In certain scenerios such as checking out the user will be redirect to different pages based on whether they logged in. 
    2. Additionally, if the user is not logged in then the profile, order, and logout pop-up will not appear as a result of this route.
6. http://localhost:3000/cuddy/order - post route that accepts the user's order tying the customer id and order id together
    1. This route collects price/payment and delivery information as well as creating a link between the customer and their orders.
7. http://localhost:3000/cuddy/order/:orderId/details - post route connected to the order id tracking which items are linked to the order.
    1. This route is activates after the route above 
    2. It establishes a link between the individual products with their specific requirements and the order id.
    3. This isolates each product with its details while also creating a relationship/thread to follow and connect multiple items to a single order. (A major issue in my first project which malfunctioned when a large amount of items were ordered) 
8. http://localhost:3000/cuddy/customer - get route that is used to acquire the user's information for their profile.
    1. The user can view their personal information after they have logged in
9. http://localhost:3000/cuddy/profile - put route allows the user to change their basic information or password.
    1. The user while viewing their profile can click the "Edit Profile" button to change basic information that may have been mistakenly input. 
    2. Alternatively, the user can click the "Change Password" button to specifically deal with that more sensitive piece of information.
    3. The user's password is hashed and not shown on their profile. 
10. http://localhost:3000/cuddy/order/history - get route allows the user to view all of the orders they have made.
    1. This makes use of the user's JWT token to gain information of every order id that is linked to that user's id.
11. http://localhost:3000/cuddy/order/:order.id/details - get route using order id to connect each order with its linked items.
    1. This route takes the seperated information of each order id from order history and populates each order with their linked products
12. http://localhost:3000/cuddy/order/:orderId - delete route allows the user delete an order.
    1. This route enables the user to delete an order before 5 minutes has passed as a grace period, in case of user error.
13. http://localhost:3000/cuddy/order/:orderId - put route changes the order to a delivered status
    1. The route automatically activates after 5 minutes has passed in real time
    2. Thereafter, the route changes the order to a delivered status and removes the user's ability to delete the order.


### Copyright

**Copyright 2024, Jonathan Cuddy, All rights reserved.**
:smiley: