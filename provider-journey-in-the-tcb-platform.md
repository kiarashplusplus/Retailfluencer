Provider Journey in the TCB Platform
Abhijit Das
Providers play a crucial role in the TCB ecosystem, enabling manufacturers to distribute AI (8112) coupons through their technology. Most importantly, providers enable consumers to hold coupons on their phones to be redeemed at retail stores.

This article will delve into the provider journey, highlighting the various APIs available on the TCB platform and providing an optimal consumer flow. We’ll also discuss the importance of becoming a certified provider and the requirements involved.

Start Your Provider Journey with TCB: Testing Recommendations

All testing will need to be completed in our try server (https://try.thecouponbureau.org). Once testing and certification are complete, the TCB team will help you migrate to production.

Register as a Manufacturer

To begin testing, you can register as a Manufacturer and create Master Offer Files (or offers). The master offer file (base gs1 data string ) has a structure like this.


To create a MOF, you’ll need first to create a Coupon Funder ID, whose information is encoded in the MOF structure and used by clearinghouses to obtain funder information from TCB for clearing (funder ID registration is a requirement within the account). Select Manage Funders from your dashboard, enter demo billing information, and choose any Manufacturer Agent from the dropdown menu. The information associated with the test funder ID has no bearing on testing, it just needs to exist.


Update company billing information.

Add Funder (either direct billing or a manufacturer agent)
The next step is to create a test brand and assign yourself as the primary provider. This ensures that any MOFs created under that brand will be authorized to your provider account for distribution.


Test brand creation and add a primary provider.
To create a master offer file, go to Create Master Offer File on your dashboard. The Master Offer File is where coupons will be deposited. Using the “Construct Base GS1” wizard will construct the base data string for you. From there, you need only add your campaign data and primary purchase requirement data.


Master offer file creation
When creating a Master Offer File, you have the flexibility to include various attributes to support complex offers. However, as a provider, you only need to ensure that the MOF has specific attributes to accept serialized GS1s. Here are the minimum attributes you need to include:

Basic Info
— Base GS1
— Description and Brand
— Campaign Start and End date — deposit will only be allowed during this time range. You need to set your appropriate timezone in enterprise settings. By default, we use the Pacific/Honolulu timezone
— Redemption Start and End date
— Total Circulation — how many serialized gs1s can be deposited.
Primary Purchase Requirements — To create a basic Master Offer File, you don’t need to provide specific values for all attributes. For testing purposes, you can set the Save value to 100, the Primary purchase requirement to 1, the Primary purchase request code to 0, and the Primary purchase GTINs to 037000038665.
For other tabs, just hit next — next and finally click save to create the master offer file.
To enable the deposit of serialized GS1s, manufacturers must lock the master offer file. After creating the MOF, you will be directed to the “View All Master Offer Files” page, where you can find your newly created MOF. Click on the “Action” button and lock the MOF. Additionally, ensure that the provider is attached to the MOF. It should connect automatically if you have already assigned the primary provider to the brand you created. If not, you can attach the provider from the action item by selecting your provider account from the list and clicking to attach it.


List of master offer files with options
Get ready to make API calls.

To make an API call to TCB, you must create an API key from the enterprise settings. It’s important to note that the secret key is displayed for only 30 seconds, after which it’s encrypted and moved from the primary database to a key vault for security purposes. Be sure to copy the secret key to a safe location for future reference.

To get started, becoming familiar with the API playground is essential. The TCB portal provides an API playground allowing you to run APIs with your data. To access it, click on the API tab in the header. The API page is divided into two sections. On the left side, you’ll see the API documentation; on the right, you’ll see the product. Select “Provider” from the right-side menu to open the provider APIs. You’ll find APIs divided into categories on the left side, including the “Authorized Master Offer Files” tab. This tab includes two APIs: one to get all authorized master offer files assigned to you by all manufacturers and another to get the details of individual master offer files.


Get ready to deposit coupon (serialized gs1)

As a provider or coupon distributor, you must serialize every coupon before depositing it. The serialized coupon will have a format that looks like this.


Serialized GS1 format
Deposit Serialized GS1 using /provider/deposit API

The deposit API has several parameters, but the only required parameter is “gs1s,” which allows you to pass the serialized gs1s (created using the format described earlier). If today’s date is within the campaign start and end dates specified in the master offer file, and the serialized gs1s format is correct, TCB will accept the deposit. You can send up to 15 serialized gs1s per deposit.

Get Abhijit Das’s stories in your inbox


Join Medium for free to get updates from this writer.

To make the API call, you must get the access token from the access and secret keys.

curl -X POST 'https://api.try.thecouponbureau.org/access_token' \
-H 'Content-Type: application/json' \
-H 'x-api-key: ACCESS_KEY' \
--data '{ 
    "access_key": "ACCESS_KEY", 
    "secret_key": "SECRET_KEY" 
}'
With the access token, call the provider deposit API.

curl -X POST 'https://api.try.thecouponbureau.org/provider/deposit' \
-H 'Content-Type: application/json' \
-H 'x-api-key: ACCESS_KEY' \
-H 'x-access-token: ACCESS_TOKEN' \
--data '{"gs1s":[<Array of serialized gs1s>]}'
When depositing, ensuring that the serialized data strings are unique and non-sequential is essential, as TCB will not accept duplicates and will return an error message accordingly. However, creating unique serialized GS1s can be challenging for providers using the data format. In such cases, the API offers a mode that allows you to shift the responsibility of generating unique serialized GS1s to the TCB layer. By setting the mode as “base_gs1”, you can send the base GS1 instead of the formatted serialized GS1s and let TCB generate unique serialized GS1s using your serialization prefix, and then deposit and return them.

curl -X POST 'https://api.try.thecouponbureau.org/provider/deposit' \
-H 'Content-Type: application/json' \
-H 'x-api-key: ACCESS_KEY' \
-H 'x-access-token: ACCESS_TOKEN' \
--data '{"gs1s":[<Array of base gs1s>],"mode":"base_gs1"}'
To deposit three serialized GS1s for the base GS1 81120211223344777026, you can pass the same base GS1 three times in the “gs1s” field.

curl -X POST 'https://api.try.thecouponbureau.org/provider/deposit' \
-H 'Content-Type: application/json' \
-H 'x-api-key: ACCESS_KEY' \
-H 'x-access-token: ACCESS_TOKEN' \
--data '{"gs1s":["81120211223344777026","81120211223344777026","81120211223344777026"],"mode":"base_gs1"}'
Using the “base_gs1” mode simplifies the creation of unique serialized GS1s for the provider but also introduces a new complexity. If a network error causes a timeout in the HTTP API request, the serialized GS1s may have been created in the TCB layer, but the provider may not have received them. Typically, providers receive the serialized GS1s in the response and associate them with a user account. To retrieve the generated serialized GS1s in such a scenario, the “client_txn_id” parameter is used. This is an ID that the provider can create on their side. After the TCB platform generates and deposits serialized GS1s, it associates the “client_txn_id” with the newly generated serialized GS1s. The provider can call the same deposit API with the same “client_txn_id” if a network timeout occurs. If data is associated with the “client_txn_id,” TCB will return it directly without creating a new one. This process makes deposit requests idempotent.

curl -X POST 'https://api.try.thecouponbureau.org/provider/deposit' \
-H 'Content-Type: application/json' \
-H 'x-api-key: ACCESS_KEY' \
-H 'x-access-token: ACCESS_TOKEN' \
--data '{"gs1s":[<Array of base gs1s>],"mode":"base_gs1","client_txn_id":"xni73-ndi73-lkf937"}'
Excellent! You have completed the deposit process, and your serialized GS1s are now ready for redemption. Your customers can now view the list of serialized GS1s in your application.

Consumer Experience Components: Bundling and Fetch Code

1. Bundling

To simplify the redemption process for both customers and retailers, we have introduced the concept of bundling. Customers have two options: either redeem a single coupon or a set of coupons in a single transaction.

Ten coupons can be bundled just by appending serialized data strings one after another. For example, if you have deposited two serialized gs1s (8112001222228888849444370980731766,8112001222228888849445147407548997) you can create a bundle just by appending two serialized gs1s one after another (81120012222288888494443709807317668112001222228888849445147407548997).

2. Fetchcode

Retailers may face difficulties scanning barcodes directly from customers’ phones in certain situations. This could be due to several reasons, such as screen brightness, phone screen size, or even a broken screen. In such cases, providers can use a “Provider-generated fetch code.” These APIs generate a short-lived 16-digit code that customers can manually provide to the cashier for redemption. The following diagram illustrates both scenarios:


Consumer experience
API to create the Time Bound Fetch Code from serialized gs1s

curl -X POST 'https://api.try.thecouponbureau.org/provider/time_bound_fetch_code' \
-H 'Content-Type: application/json' \
-H 'x-api-key: ACCESS_KEY' \
-H 'x-access-token: ACCESS_TOKEN' \
--data '{"gs1s":[<Array of base gs1s>], "fetch_code": "...", "mode": "...", validity_in_seconds: "..."}'
Redemption and Rollback of Webhook notifications

The TCB platform sends webhook notifications to providers to handle the redemption and rollback of serialized gs1s. Providers should set up their webhook endpoint to receive these notifications and update their user interface accordingly by notifying the user in the app and removing the redeemed coupons from their available coupon list. Please follow the below article to learn TCB webhook infrastructure.

Scalable Webhook Infrastructure designed to push billions of events to customer endpoints reliably

Designing billions of webhook HTTP can be a challenging task due to several reasons. Webhooks are real-time…


developer.thecouponbureau.org

Other Usage of Time-bound Fetch Code

The time-bound fetch code has additional applications beyond redemption and rollback of serialized gs1s. Providers can utilize this feature to run SMS or in-store campaigns. We have ensured that each provider receives a unique set of 100 million time-bound codes, eliminating any chance of collisions between providers. Please refer to the article below for more information on the time-bound fetch code.

Expanding Coupon Accessibility: Catering to Non-Smartphone Users

Non-smartphone users are a crucial segment that can greatly benefit from the coupon industry. Despite their heavy…


developer.thecouponbureau.org

Get Certified

After successfully integrating, you can initiate the provider certification process. To begin the certification process, a TCB team member can provide the certification form.

After successfully completing the provider certification process, your provider production account can be created.

phone_hash & share_with parameters during the deposit

For various reasons, providers may need to share content with other providers. To address this, providers can use these two attributes to send coupons to other apps or provider properties, which we call “sharing apps.” Refer to the article below to understand how this process works.

Cross-app coupon sharing feature

As AI (8112) Universal Coupons become more widely used by consumers, it is likely that a consumer will begin storing…


developer.thecouponbureau.org

Suppose you have a coupon application and want to expand your reach by participating in the sharing app ecosystem, which allows other apps to share their content with your app. By doing so, you can collaborate with small and medium-sized providers who do not have their apps and offer them the opportunity to use your app. Please refer to the following article to learn more about making your provider app compatible with the sharing app ecosystem.

Making Your Coupon App Compatible with TCB's Sharing Process

TCB is introducing Cross-app coupon sharing to address the potential complexity and inconvenience arising from…


developer.thecouponbureau.org

Conclusion

This article serves as a comprehensive guide to integrating as a provider in the TCB platform, obtaining certification, and the benefits of doing so. It outlines the steps involved in starting with the TCB try server, building the app, obtaining certification, and moving to the production server. Additionally, it discusses the recommended consumer experience that providers should aim to create and highlights some advanced use cases by providing relevant links, such as how to run an 8112 campaign in a feature phone. Overall, this article aims to provide an overview of the TCB platform integration process and serve as a helpful resource for providers looking to integrate with TCB.