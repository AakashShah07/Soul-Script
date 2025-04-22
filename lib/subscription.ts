import  {auth, currentUser} from "@clerk/nextjs/server"

import prismadb from "./prismadb"

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const checkSubscription = async () => {

    const user = await currentUser();

    if (!user) {
        return false;
    }

    const userSubscription = await prismadb.userSubsciption.findUnique({

        where :{
            userId: user.id
        },
        select:{
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
        }

    });

    if (!userSubscription) {
        return false;
    }
    const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return !!isValid;
}
