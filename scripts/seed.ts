const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {

    try {
        
        await db.category.createMany({
            data:[
                {name:"Famous People"},
                {name:"Movies & TV"},
                {name:"Musicians"},
                {name:"Ghost"},
                {name:"Animals"},
                {name:"Philosophy"},
                {name:"Scientists"},
                {name:"Anime Characters"},
                {name:"Gods"}
                               
            ]
        })

    } catch (error) {
        console.error("error seeding default categories", error);
    }
    finally{
        await db.$disconnect();
    }
  //change to reference a table in your schema
//   const val = await db.cat.findMany({
//     take: 10,
//   });
//   console.log(val);
}

// main()
//   .then(async () => {
//     await db.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await db.$disconnect();
//   process.exit(1);
// });
main();
