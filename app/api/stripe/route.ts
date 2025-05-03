import  {currentUser} from "@clerk/nextjs/server"
import prismadb from "@/lib/prismadb"

import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe";

import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/setting")

export async function GET(){
    
    try {
        
        const user = await currentUser();
        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userSubscription = await prismadb.userSubsciption.findUnique({
            where:{
                userId: user.id
            }
        });

        if (userSubscription && userSubscription.stripeCustomerId){
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            });

            return new NextResponse(JSON.stringify({url: stripeSession.url}));
        }

        console.log("UserId is ",user.id)
        const userId = user.id
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email:user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data:{
                        currency:"USD",
                        product_data:{
                            name:"soul_pro",
                            description:"Create custom AI powered souls"
                        },
                        unit_amount: 199, // 💥 FIXED HERE
                        recurring:{
                            interval:"month"
                        }
                    },
                    
                    quantity:1
                }
            ],
            metadata:{
                userId
            }
        });

        return new NextResponse(JSON.stringify({url:stripeSession.url}));

    } catch (error) {
        console.log("[STRIPE_GET]", error);
        return new Response("Internal Error", { status: 500 });
        
    }
}

