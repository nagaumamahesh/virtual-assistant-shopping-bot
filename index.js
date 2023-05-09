const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.TOKEN);
const groupId = -941162935;
let purchasedItems = [];
let orderAccepted = false;

//Owner Commands
const orders = [
    {
        username: 'Rama',
        email: 'rama@gmail.com',
        deliveryAddress: 'H.NO: #1/a chittinagar, Vijayawda',
        item: {
            brand: 'Apple',
            price: 20,
            quantity: 2
        },
        total: 40
    },
    {
        username: 'Siva',
        email: 'siva@gmail.com',
        deliveryAddress: 'Near SrinivasaMahal, Vijayawada',
        item: {
            brand: 'Dove',
            price: 50,
            quantity: 1
        },
        total: 50
    },
    {
        username: 'Pallavi',
        email: 'pallavi@gmail.com',
        deliveryAddress: 'Near sairam, Vijayawada',
        item: {
            brand: 'Lays',
            price: 50,
            quantity: 3
        },
        total: 150
    }
];

bot.command('ownerStart', (ctx) => {
    if (ctx.chat.id === groupId) {
        let msg = `*Here are the Owner Commands:*\n\n` +
            `- /displayaccepted - Displays the accepted orders\n` +
            `- /displayall - Displays the accepted orders\n` +
            `- /insights - Displays the insights like revenue generated , top buying customers etc`;
        bot.telegram.sendMessage(groupId, msg, { parse_mode: "Markdown" });
    }
});

bot.command(['displayaccepted', 'displayall'], (ctx) => {
    if (ctx.chat.id === groupId) {
        let message = '';
        orders.forEach((order) => {
            message += `Username: ${order.username}\nEmail: ${order.email}\nDelivery Address: ${order.deliveryAddress}\nItem: ${order.item.brand} - ${order.item.price} x ${order.item.quantity}\nTotal: ${order.total}\n\n`;
        });
        ctx.reply(message);
    }
});

bot.command('insights', (ctx) => {
    if (ctx.chat.id === groupId) {
        insights = {
            totalOrders: 3,
            totalItemsSold: 14,
            revenue: 700,
            topSellingItems: { Apple: 2, Tomato: 3, Dove: 1, Colgate: 2, Butter: 1, Lays: 4 },
            topBuyingCustomers: { John: 5, Mary: 3, Bob: 6 }
        }
        let message = `Total orders: ${insights.totalOrders}\n`;
        message += `Total items sold: ${insights.totalItemsSold}\n`;
        message += `Revenue: $${insights.revenue}\n`;
        message += "\nTop selling items:\n";
        for (const item in insights.topSellingItems) {
            message += `- ${item}: ${insights.topSellingItems[item]}\n`;
        }
        message += "\nTop buying customers:\n";
        for (const customer in insights.topBuyingCustomers) {
            message += `- ${customer}: ${insights.topBuyingCustomers[customer]}\n`;
        }
        ctx.reply(message);
    }
});

//User Commands 
let items = [
    {
        category: 'Groceries',
        subcategory: 'Fruits',
        brand: 'Apple',
        price: 20,
        quantity: 100,
    },
    {
        category: 'Groceries',
        subcategory: 'Fruits',
        brand: 'Banana',
        price: 10,
        quantity: 200,
    },
    {
        category: 'Groceries',
        subcategory: 'Vegetables',
        brand: 'Tomato',
        price: 15,
        quantity: 150,
    },
    {
        category: 'Groceries',
        subcategory: 'Vegetables',
        brand: 'Potato',
        price: 12,
        quantity: 300,
    },
    {
        category: 'Bakery',
        subcategory: 'Bread',
        brand: 'WhiteBread',
        price: 25,
        quantity: 50,
    },
    {
        category: 'Bakery',
        subcategory: 'Bread',
        brand: 'BrownBread',
        price: 30,
        quantity: 80,
    },
    {
        category: 'Bakery',
        subcategory: 'Biscuits',
        brand: 'ParleG',
        price: 10,
        quantity: 200,
    },
    {
        category: 'Bakery',
        subcategory: 'Biscuits',
        brand: 'GoodDay',
        price: 20,
        quantity: 100,
    },
    {
        category: 'Dairy',
        subcategory: 'Milk',
        brand: 'Amul',
        price: 50,
        quantity: 120,
    },
    {
        category: 'Dairy',
        subcategory: 'Cheese',
        brand: 'AmulCheeseSlice',
        price: 60,
        quantity: 80,
    },
    {
        category: 'Personal Care',
        subcategory: 'Body Care',
        brand: 'DoveSoap',
        price: 35,
        quantity: 100,
    },
    {
        category: 'Personal Care',
        subcategory: 'Body Care',
        brand: 'NiveaLotion',
        price: 120,
        quantity: 70,
    },
    {
        category: 'Personal Care',
        subcategory: 'Oral Care',
        brand: 'ColgateToothpaste',
        price: 30,
        quantity: 150,
    },
    {
        category: 'Personal Care',
        subcategory: 'Oral Care',
        brand: 'ListerineMouthwash',
        price: 50,
        quantity: 50,
    },
    {
        category: 'Household',
        subcategory: 'Cleaning Supplies',
        brand: 'Surf-Excel-Detergent-Powder',
        price: 40,
        quantity: 200,
    },
    {
        category: 'Household',
        subcategory: 'Cleaning Supplies',
        brand: 'VimDishwash',
        price: 30,
        quantity: 150,
    }
];

function cartHandler(ctx) {
    let msg = 'Here are the items in your cart:\n\n';
    if (purchasedItems.length === 0) {
        msg = 'Your cart is empty';
    } else {
        for (const item of purchasedItems) {
            msg += ` \\- ${item.brand} (₹${item.price}, ${item.quantity} purchased) = ₹${item.price * item.quantity}\n`;
        }
        msg += `\nTotal: ₹${purchasedItems.reduce((total, item) => total + item.price * item.quantity, 0)}`;
    }
    return msg;
}

bot.start((ctx) => {
    let ownerMsg = `*New User:*\n\n` +
        `Username : *${ctx.from.first_name}* \nTelegram id :*${ctx.from.id}* \nhas contacted the store`
    bot.telegram.sendMessage(groupId, ownerMsg, { parse_mode: 'Markdown' });
    userId = ctx.chat.id;
    let startMsg = `⭐<b>Welcome to the Online General Store 🤖🛒,  ${ctx.from.first_name}!</b>\n\n`;
    startMsg += `👉We have a wide range of products available for <b>purchase, including groceries, household items, and electronics.</b> To get started, simply browse our /menu or use the search function to find specific items.\n\n`;
    startMsg += `👉You can add items to your /cart and  /checkout at any time.\n\n`;
    startMsg += `👉If you have any questions use /help or need assistance with your order, our <b>customer support team</b> is available <b>24/7</b> to help you. \n\n`;
    startMsg += `👉Thank you for choosing our <b>General Store</b> for your shopping needs!\n\n`;

    ctx.reply(startMsg, { parse_mode: 'HTML' });
});

bot.command('newitems', (ctx) => {
    let msg = '*The following is an announcement for newly available brand items:\n\n*';
    msg += `We are excited to announce the arrival of fresh brand items. Our inventory now includes the following products:\n\n`
    msg += `*Vim Dishwash Gel*: This new product is available at a *cost of 30 rupees* and is now on the market\n\n`;
    msg += `*Listerine Mouthwash*: Another new addition to our lineup, this mouthwash is available at a *cost of 50 rupees* and is now available for purchase.\n\n`;
    msg += `*Nivea Lotion*: This new lotion is now available at a *cost of 120 units*. It has just hit the market and we have a good amount of stock available.\n`;
    msg += `\nThank you for choosing our brand for your personal care needs. We hope you enjoy our new products!\n`;
    bot.telegram.sendMessage(ctx.chat.id, msg, { parse_mode: 'Markdown' });
})


bot.help((ctx) => {
    let msg = `*Available commands:*\n\n` +
        `- /start: Displays the welcome message\n` +
        `- /menu: Displays the available items\n` +
        `- /add \`<item>\` \`<quantity>\`: Adds items to the cart\n` +
        `- /delete \`<item>\` \`<quantity>\`: Removes purchased items from the cart\n` +
        "- /search <item> : searches for the item in the menu\n" +
        `- /total: Displays the total cost of items in the cart\n` +
        `- /cart: Displays the items currently in the cart\n` +
        `- /checkout: Sends the order to the owner for acceptance\n` +
        `- /status: Displays the status of the order (accepted or not)\n` +
        "- /reviews: Displays customer reviews and feedback about the store\n" +
        "- /feedback <item>: Displays customer reviews of the item randomly \n" +
        "- /newitems: Displays new items available in the store\n" +
        "- /help: Displays a list of available commands\n";

    bot.telegram.sendMessage(ctx.chat.id, msg, { parse_mode: 'Markdown' })

});

bot.hears(/^(?!\/)/, (ctx) => {
    ctx.reply('Please use commands or use /help command. ');
});

bot.command('menu', (ctx) => {
    let itemsByCategory = {};
    let msg = 'Here are the available items:\n\n';
    items.forEach((item) => {
        if (!itemsByCategory[item.category]) {
            itemsByCategory[item.category] = {};
        }
        if (!itemsByCategory[item.category][item.subcategory]) {
            itemsByCategory[item.category][item.subcategory] = [];
        }
        itemsByCategory[item.category][item.subcategory].push(item);
    });
    for (const [category, subcategories] of Object.entries(itemsByCategory)) {
        msg += `<b>${category}:</b>\n`;
        for (const [subcategory, items] of Object.entries(subcategories)) {
            msg += `  <b>${subcategory}:</b>\n`;
            for (const item of items) {
                msg += `    - ${item.brand} (₹${item.price}, ${item.quantity} left)\n`;
            }
        }
        msg += '\n';
    }
    bot.telegram.sendMessage(ctx.chat.id, msg, { parse_mode: 'HTML' });
});

bot.command('add', ctx => {
    const args = ctx.message.text.split(' ');
    if (args.length !== 3 || isNaN(args[2])) {
        ctx.reply('Invalid command. Please use the format /add <brand> <quantity>');
        return;
    }
    const brand = args[1];
    const quantity = parseInt(args[2]);
    const item = items.find((i) => i.brand.toLowerCase() === brand.toLowerCase());
    if (!item) {
        ctx.reply(`Item ${brand} not found`);
        return;
    }
    if (item.quantity < quantity) {
        ctx.reply(`Sorry, there are only ${item.quantity} ${item.brand} left`);
        return;
    }
    purchasedItems.push({ "brand": item.brand, "quantity": quantity, "price": item.price });
    item.quantity -= quantity;
    let msg = `${quantity} ${item.brand} added to your cart\n\n Similar things brought by Other Customers:\n\n -parle-G\n -GoodDay\n\n Have a try`;
    ctx.reply(msg);
})

bot.command('total', (ctx) => {
    let total = 0;
    purchasedItems.forEach(item => { total += item.price * item.quantity });
    const msg = `Your total is ₹${total}`;
    ctx.reply(msg);
});

bot.command('delete', (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length !== 3 || isNaN(args[2])) {
        ctx.reply(
            'Please use the following format: /delete [brand] [quantity]'
        );
        return;
    }
    const brand = args[1];
    const quantity = parseInt(args[2]);
    const itemIndex = items.findIndex(
        (item) => item.brand.toLowerCase() === brand.toLowerCase()
    );
    if (itemIndex === -1) {
        ctx.reply('Invalid Item');
        return;
    }
    if (quantity <= 0) {
        ctx.reply('Please enter a positive integer for the quantity');
        return;
    }
    const purchasedItemIndex = purchasedItems.findIndex(
        (item) => item.brand.toLowerCase() === brand.toLowerCase()
    );
    if (purchasedItemIndex === -1) {
        ctx.reply('You have not purchased this item ');
        return;
    }
    const purchasedItem = purchasedItems[purchasedItemIndex];
    if (quantity > purchasedItem.quantity) {
        ctx.reply(`You have purchased only ${purchasedItem.quantity} of this item.Use /cart to see the quantity of your orders`);
        return;
    }
    purchasedItem.quantity -= quantity;
    items[itemIndex].quantity += quantity;
    if (purchasedItem.quantity === 0) {
        purchasedItems.splice(purchasedItemIndex, 1);
    }
    let msg = `${quantity} ${brand} has been removed from your cart`;
    msg += '\n';
    msg += cartHandler(ctx);
    ctx.reply(msg);
});

bot.command('cart', (ctx) => {
    let msg = cartHandler(ctx);
    ctx.reply(msg);
});

let userId;
bot.command('checkout', (ctx) => {
    const userName = ctx.from.first_name;
    userId = ctx.from.id;

    if (purchasedItems.length === 0) {
        ctx.reply('Your cart is Empty');
        return;
    }
    let address = "Chittinagar, Vijayawada";
    let ownerMessage = "You have a new order  from " + userName + "( ID: " + userId + "): \n\n";
    let customerMsg = "Order Details : \n\nusername : " + userName + "\n\n";
    let orderDetailsMsg = '\n';
    purchasedItems.forEach((item) => {
        orderDetailsMsg += `${item.brand}\n`;
        orderDetailsMsg += `Quantity: ${item.quantity} \n`;
        orderDetailsMsg += `Price per item: ₹${item.price}\n`;
        orderDetailsMsg += `This Section price : ₹${item.quantity * item.price}\n`;
        orderDetailsMsg += '\n';
    });
    const totalAmount = purchasedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    orderDetailsMsg += `Total amount: ₹${totalAmount} \n`;
    orderDetailsMsg += `\nAddress: ${address}\n\n`;
    ownerMessage += orderDetailsMsg;
    customerMsg = customerMsg + orderDetailsMsg;

    bot.telegram.sendMessage(ctx.chat.id, customerMsg, { parse_mode: 'Markdown' });
    bot.telegram.sendMessage(groupId , ownerMessage , {parse_mode: 'HTML'});
    bot.telegram.sendMessage(groupId, ownerMessage, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Reject', callback_data: 'reject' }, { text: 'Approve', callback_data: 'approve' }]
            ]
        }
    });

})


bot.on('callback_query', (ctx) => {
    const data = ctx.callbackQuery.data
    if (data === 'approve') {
        orderAccepted = true;
        bot.telegram.sendMessage(userId, 'Your Orders are accepted and ready for delivery');
    }
    else {
        orderAccepted = false;
        bot.telegram.sendMessage(userId, 'Your checkout request has been rejected.');
        purchasedItems.forEach((item) => {
            const i = items.find((i) => i.brand === item.brand);
            i.quantity += item.quantity;
        });
    }
    purchasedItems = [];
    ctx.deleteMessage();
    return;
});

bot.command('search', (ctx) => {
    const searchTerm = ctx.message.text.split(' ').slice(1).join(' ').toLowerCase();
    const matchedItems = items.filter(item => {
        const brand = item.brand.toLowerCase();
        const subcategory = item.subcategory.toLowerCase();
        return brand.startsWith(searchTerm) || subcategory.startsWith(searchTerm);
    });
    let response = '';
    if (matchedItems.length === 0) {
        response = 'No items found matching that search term.';
    } else {
        matchedItems.forEach(item => {
            response += `${item.brand} (${item.subcategory})\nCost: ${item.price}, Quantity: ${item.quantity}\n\n`;
        });
    }
    ctx.reply(response);
});

bot.command('status', (ctx) => {
    if (orderAccepted == false) {
        ctx.reply('Your Order is Pending');
        return;
    } else {
        ctx.reply('Your Order is Accepted and out for Delivery');
    }
})

const reviews = [
    { username: 'JohnDoe', message: 'Great store with a wide variety of products!' },
    { username: 'JaneSmith', message: 'Friendly staff and excellent service.' },
    { username: 'BobJohnson', message: 'Clean and organized store with competitive prices.' },
];

bot.command('reviews', (ctx) => {
    let response = '';
    for (const review of reviews) {
        response += `Username: ${review.username}\nReview: ${review.message}\n\n`;
    }
    ctx.reply(response);
});

const feedbackMessages = [
    "Great choice, this item is known for its excellent quality!",
    "Nice! You won't regret purchasing this item.",
    "This is a bestseller - definitely worth adding to your cart.",
    "Good choice! This item has a lot of positive reviews.",
    "Excellent pick! Customers love the quality of this product.",
    // "You made a wise choice - this item is known for being long-lasting.",
    // "Highly recommended! This item is a customer favorite.",
    // "This item is definitely worth the investment. You won't be disappointed.",
    // "Good quality and great value - you can't go wrong with this item.",
    // "Customers rave about this product. You made a great decision.",
];

bot.command('feedback', (ctx) => {
    const arr = ctx.message.text.split(' ');
    if (arr.length !== 2) {
        ctx.reply('This command requires 1 argument - /feedback <itemname>')
        return;
    }
    const brand = arr[1];
    const item = items.find(item => item.brand.toLowerCase() === brand.toLowerCase());

    if (!item) {
        ctx.reply(`Sorry, we could not find any item with the brand "${brand}".`);
    } else {
        const feedbackMessage = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
        ctx.reply(`Feedback for ${item.brand}: ${feedbackMessage}`);
    }
});

bot.hears(/.*/, (ctx) => {
    ctx.reply('Sorry, I don\'t understand that command. Please use one of the available commands or type /help for assistance.');
});

bot.launch();
console.log('Bot Stated');
