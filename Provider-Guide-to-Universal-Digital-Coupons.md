Provider Guide to Universal Digital Coupons
Updated: October 15, 2025
1.0 Overview
Distribution providers are responsible for the management (deposit and distribution) of the serialized data strings on behalf of their manufacturer partners and the consumer experience.This article should serve as a guide to the management of serialized data strings as well as required and optional consumer experience components.At the end of the article, we will review the certification process required to become a Certified Universal Coupons Distribution Provider. This certification serves as a functional requirements checklist to ensure all distribution providers are adhering in compliance with all required functionality.
2.0 Management of Serialized Data Strings
It is the responsibility of the distribution provider to serialize the base data string and deposit that serialized data string into the Master Offer File on behalf of the manufacturer. The format of the serial number is as follows:
￼

The Deposit API has several parameters, but the only required parameter is gs1s, which allows you to pass serialized GS1s created using the correct format.If today’s date is within the campaign start and end dates specified in the master offer file, and the GS1s are correctly formatted, TCB will accept the deposit. You may send up to 20 serialized GS1s per deposit.
2.1 Get an Access Token
Before calling the Deposit API, you must obtain an access token using your access and secret keys:curl -X POST 'https://api.try.thecouponbureau.org/access_token' \-H 'Content-Type: application/json' \-H 'x-api-key: ACCESS_KEY' \--data '{   "access_key": "ACCESS_KEY",   "secret_key": "SECRET_KEY"}'
2.2 Deposit Serialized GS1s
Once you have an access token, call the Provider Deposit API with your serialized GS1s:curl -X POST 'https://api.try.thecouponbureau.org/provider/deposit' \-H 'Content-Type: application/json' \-H 'x-api-key: ACCESS_KEY' \-H 'x-access-token: ACCESS_TOKEN' \--data '{"gs1s":[<Array of serialized gs1s>]}'When depositing, ensure that the serialized data strings:- Include your serialization prefix (available via API and in Enterprise Settings).- Are unique and non-sequential.If duplicates are submitted, TCB will reject them and return an error.
2.3 Using base_gs1 Mode
The API also allows TCB to generate serialized GS1s on your behalf. By setting the mode to base_gs1, you can send only the base GS1 values, and TCB will generate unique serialized GS1s with your prefix, then deposit and return them:curl -X POST 'https://api.try.thecouponbureau.org/provider/deposit' \-H 'Content-Type: application/json' \-H 'x-api-key: ACCESS_KEY' \-H 'x-access-token: ACCESS_TOKEN' \--data '{"gs1s":[<Array of base gs1s>],"mode":"base_gs1"}'Example: To deposit three serialized GS1s for the base GS1 81120211223344777026, pass the base GS1 three times:curl -X POST 'https://api.try.thecouponbureau.org/provider/deposit' \-H 'Content-Type: application/json' \-H 'x-api-key: ACCESS_KEY' \-H 'x-access-token: ACCESS_TOKEN' \--data '{"gs1s":["81120211223344777026","81120211223344777026","81120211223344777026"],"mode":"base_gs1"}'Important Considerations with base_gs1:Using base_gs1 mode simplifies deposit creation but introduces a risk:- If a network error or HTTP timeout occurs, the GS1s may be created in the TCB layer without the provider receiving them.- Without a client_txn_id, you cannot confirm whether the deposit succeeded.Best Practice: Always include a client_txn_id when depositing with base_gs1 mode.Example with client_txn_id:curl -X POST 'https://api.try.thecouponbureau.org/provider/deposit' \-H 'Content-Type: application/json' \-H 'x-api-key: ACCESS_KEY' \-H 'x-access-token: ACCESS_TOKEN' \--data '{"gs1s":[<Array of base gs1s>],"mode":"base_gs1","client_txn_id":"xni73-ndi73-lkf937"}'
Depositing with Pre-Generated Serialized Data:
When using pre-generated serialized GS1s, deposits are naturally idempotent:- If the original attempt failed, retrying completes the deposit.- If it already succeeded, retrying returns an “already deposited” response.This ensures reliable deposits in both modes, provided client_txn_id is used with base_gs1.

3.0 Consumer Experience: Required and Optional Functionality

3.1 Presentment: Barcode selectionUniversal Digital Coupons do not have a barcode standard at this time. The purpose of this stance was to provide all industries room for future innovation as new scanning capabilities gain market traction. Our current recommendation is the use of a code-128 barcode which can hold a single coupon data string or a fetch code that can represent a bundle of coupons.3.2 Time Bound Fetch CodeFetch code is a required function.A Time-bound Fetch code, or Fetch Code, gives the shopper an alternative shortened code in the event that the barcode cannot be scanned by a cashier. The fetch code is a 16-digit code that customers can manually provide to the cashier for redemption. The lifespan of the Fetch Code is determined by the provider and can represent one or more coupons.API to create the Time Bound Fetch Code from serialized gs1s:curl -X POST 'https://api.try.thecouponbureau.org/provider/time_bound_fetch_code' \-H 'Content-Type: application/json' \-H 'x-api-key: ACCESS_KEY' \-H 'x-access-token: ACCESS_TOKEN' \--data '{"gs1s":[<Array of base gs1s>], "fetch_code": "...", "mode": "...", validity_in_seconds: "..."}'
3.3 Bundling
Bundling is optional but strongly recommended.The bundling feature allows multiple serialized data strings to be “bundled” into one barcode to scan. Bundling can be accomplished two ways: server-side bundling by a Fetch Code or local bundling through concatenating data strings together in a QR code.Server-side bundling is accomplished by using the Fetch Code API to create a Fetch Code that represents up to 10 serialized data strings.Local bundling does not require any API calls. It is accomplished by concatenating up to 10 serialized data strings. For example, bundling 8112001222228888849444370980731766 and 8112001222228888849445147407548997 would appear as “81120012222288888494443709807317668112001222228888849445147407548997” inside of a QR Code.Should more than 10 coupons need to be bundled, another bundle should be created and displayed in a second QR Code.Our current recommendation is server-side bundling. Local bundling supports faster processing at the POS and offline redemptions but implementation will need to occur when QR codes are more widely accepted.
3.4 Metadata
Metadata can be added to the Master Offer File to provide additional campaign details to partners for displaying coupons in the consumer experience.
Metadata can be added to the Master Offer File so that additional campaign details can be passed to partners to aid in the display of the coupon in the consumer experience. Metadata includes:

* 		Coupon Title - This text is intended to be used as the title of the coupon 
* 		Offer Description - This text is intended to be used as the offer details of the coupon (ex. Valid on any TWO products, excluding travel-sized products)
* 		Sub-Description – This text is intended to be used as additional information required to support the description but requires a separation. 
* 		Campaign Images: 
* 		Coupon Pack Shot 
* 		Company/ Brand Logo
* 		Other Image
* 		Dollar amount - This text is intended to provide the savings value to the consumer.
* 		Terms of Use - This text is intended to provide the legal terms and conditions of the coupon.


All Metadata can be added through the Master Offer File UI or via API. 

Field Specifications: 

* 		Coupon Title (e.g., Save $3.00; Save $10.00; Spend $20, Get $5; Buy One Get One Free)  
* 		Field Length:   Max 50 characters; Guideline 15 to 25 characters
* 		Offer Description (e.g., Save $3.00 on any ONE (1) Brand Name® product 40ct or larger, excludes trial sizes; Get $2.00 off any ONE (1) package of Brand Name® Product Name® item (10ct. or larger))
* 		Field Length:   Max 1,000 characters; Guideline 75 to 500 characters
* 		Sub-Description (for mandatory disclaimers displayed in a smaller font size, e.g., Use only as directed; Use as Directed.  Follow with water) 
* 		Field Length:   Max 100 characters; Guideline 25 to 50 characters
* 		Campaign Images  
* 		Coupon Pack Shot 
* 		Company Logo
* 		Other (optional) 
* 		Field Format:  provide only high-resolution for timage(s) in either jpeg or png format  
* 		Add size recommendations
* 		Dollar Amount (used to calculate total coupon savings, must be input without $ dollar sign), e.g.  Save value of $5.00 should be entered as 5.00; and Save value of $0.75 should be entered as .75 
* 		Field Length:   Max 6 characters; Guideline 3 to 6 characters
* 		Terms of Use Text (Legal copy)
* 		Field Length:   Max 1,500 characters; Guideline 750 to 1,000 characters
* 		When inputting Terms of Use from portal interface, an editor is available to aide in text formatting.

3.4 Coupon Display Requirement
At the request of a national retailer partner, TCB requires all distribution providers to include “SCAN FROM PHONE TO REDEEM” in the AI (8112) consumer experience. This ensures consistency with cashier recognition across mobile coupons.

￼
4.0 Provider Certification
Our Provider Certification ensures all providers have appropriately developed the minimum functionality required to distribute AI (8112) coupons to consumers.  The components of certification are as follows: 
* 		Ability to successfully deposit non-sequential serialized data strings 
* 		Proof of consumer experience for each presentment methodology (Ex. mobile coupon application, native phone wallet, PWA) that includes serialized data string presented in a barcode with fetch code functionality. 
* 		Documentation of consumer authentication, bundling capabilities, and security and performance.

For more information regarding Distribution Provider requirements or certification, contact us now! 
