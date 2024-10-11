import { test, expect } from 'playwright-test-coverage';

//passes!
test('load home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

//should pass!
test('purchase with login', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Veggie', price: 0.0038 },
        { menuId: 2, description: 'Pepperoni', price: 0.0042 },
      ],
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});

//should work!
test('register new user', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const regReq = { name: 'warren', email: '123@gmail.com', password: '123' };
    const regRes = { user: { id: 3, name: 'warren', email: '123@gmail.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(regReq);
    await route.fulfill({ json: regRes });
  });


  await page.goto('http://localhost:5173/');
  await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');

  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByPlaceholder('Full name').fill('warren');
  await page.getByPlaceholder('Full name').press('Tab');
  await page.getByPlaceholder('Email address').fill('123@gmail.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('123');
  await page.getByPlaceholder('Password').press('Tab');
  await page.locator('div').filter({ hasText: /^Password$/ }).getByRole('button').press('Tab');
  await expect(page.getByText('Welcome to the party')).toBeVisible();
  await page.getByRole('button', { name: 'Register' }).click();

});

//passes!
test('view about information', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByText('The secret sauce')).toBeVisible();
  await expect(page.getByText('© 2024 JWT Pizza LTD. All')).toBeVisible();
});

//passes!
test('view history', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByText('Mama Rucci, my my')).toBeVisible();
  await expect(page.getByText('© 2024 JWT Pizza LTD. All')).toBeVisible();
});

//passes!
test('view franchise page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
  await page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByText('So you want a piece of the')).toBeVisible();
  await expect(page.getByText('© 2024 JWT Pizza LTD. All')).toBeVisible();
});

//passes!
test('view diner dashboard', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.goto('http://localhost:5173/');
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
  
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByText('KC').click();
  await expect(page.getByText('Your pizza kitchen', { exact: true })).toBeVisible();
});


//passes!
test('access admin franchise page', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.goto('http://localhost:5173/');
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByLabel('Global').getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByText('Mama Ricci\'s kitchen', { exact: true })).toBeVisible();
 });



 test('create a new franchise', async ({ page }) => {
  var firstCall = true;

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'a@jwt.com', password: 'admin' };
    const loginRes = { user: { id: 1, name: '常用名字', email: 'a@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    if (route.request().method() == 'POST') {
      const franchReq = {"name": "newFranch", "admins": [{"email": "a@jwt.com"}], "stores": [],};
      const franchRes = {
        "stores": [],
        "name": "newFranch",
        "admins": [
          {
            "email": "a@jwt.com",
            "id": 1,
            "name": "常用名字"
          },
        ],
        "id": 1};

      //const franchRes = {"karma": "haha"};

      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toMatchObject(franchReq);
      await route.fulfill({ json: franchRes });
    }
    else { //GET request
      if (Boolean(firstCall)) {
        firstCall = false;
        const getResp = []

        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: getResp });

      }
      else {//the second call
        const getResp = [
          {
            "id": 1,
            "name": "newFranch",
            "stores" : [],
          }
        ]

        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: getResp });
      }
    }
  });

  await page.goto('http://localhost:5173/');
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByLabel('Global').getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByText('Mama Ricci\'s kitchen', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByText('Create franchise', { exact: true })).toBeVisible();

  await page.getByPlaceholder('franchise name').fill('newFranch');
  await page.getByPlaceholder('franchise name').press('Tab');
  await page.getByPlaceholder('franchisee admin email').fill('a@jwt.com');
  await page.getByPlaceholder('franchisee admin email').press('Tab');
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByText('Mama Ricci\'s kitchen', { exact: true })).toBeVisible();
  //console.log();
  //await expect(page.getByRole('cell', { name: 'newFranch' })).toBeVisible();

  //


 });

 //passes!
 test('call docs', async ({ page }) => {
  // await page.goto('http://localhost:5173/');
  // await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
 
  // await page.goto('http://localhost:5173/docs')
    
  // await expect(page.getByText('JWT Pizza API')).toBeVisible();
  // await expect(page.getByRole('heading', { name: '[GET] /api/order/menu' })).toBeVisible();
  

  await page.goto('http://localhost:5173/');
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();

  await page.goto('http://localhost:5173/docs');
  await expect(page.getByText('JWT Pizza API')).toBeVisible();
  await expect(page.getByRole('heading', { name: '[POST] /api/auth' })).toBeVisible();
  
  
});

// test('get a users franchises', async ({ page }) => {
//   var firstCall = true;

//   await page.route('*/**/api/auth', async (route) => {
//     const loginReq = { email: 'a@jwt.com', password: 'admin' };
//     const loginRes = { user: { id: 1, name: '常用名字', email: 'a@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
//     expect(route.request().method()).toBe('PUT');
//     expect(route.request().postDataJSON()).toMatchObject(loginReq);
//     await route.fulfill({ json: loginRes });
//   });

//   await page.route('*/**/api/franchise', async (route) => {
//     if (route.request().method() == 'POST') {
//       const franchReq = {"name": "new franch", "admins": [{"email": "a@jwt.com"}]};
//       const franchRes = {
//         "name": "new franch",
//         "admins": [
//           {
//             "email": "a@jwt.com",
//             "id": 1,
//             "name": "常用名字"
//           }
//         ],
//         "id": 1};

//       expect(route.request().method()).toBe('POST');
//       expect(route.request().postDataJSON()).toMatchObject(franchReq);
//       await route.fulfill({ json: franchRes });
//     }
//     else { //GET request
//       if (Boolean(firstCall)) {
//         firstCall = false;
//         const getResp = []

//         expect(route.request().method()).toBe('GET');
//         await route.fulfill({ json: getResp });

//       }
//       else {//the second call
//         const getResp = [
//           {
//             "id": 1,
//             "name": "new franch",
//             "stores" : []
//           }
//         ]

//         expect(route.request().method()).toBe('GET');
//         await route.fulfill({ json: getResp });
//       }
//     }
//   });

//   await page.route('*/**/api/franchise/:userID', async (route) => {
//     expect(route.request().method()).toBe('GET');
//     const getResp = []

//     await route.fulfill({ json: getResp });

//   });



//   await page.goto('http://localhost:5173/');
//   await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();

//   await page.getByRole('link', { name: 'Login' }).click();
//   await page.getByPlaceholder('Email address').fill('a@jwt.com');
//   await page.getByPlaceholder('Email address').press('Tab');
//   await page.getByPlaceholder('Password').fill('admin');
//   await page.getByRole('button', { name: 'Login' }).click();

//   await page.getByLabel('Global').getByRole('link', { name: 'Admin' }).click();
//   await expect(page.getByText('Mama Ricci\'s kitchen', { exact: true })).toBeVisible();

//   await page.getByRole('button', { name: 'Add Franchise' }).click();
//   await expect(page.getByText('Create franchise', { exact: true })).toBeVisible();

//   await page.getByPlaceholder('franchise name').fill('new franch');
//   await page.getByPlaceholder('franchise name').press('Tab');
//   await page.getByPlaceholder('franchisee admin email').fill('a@jwt.com');
//   await page.getByPlaceholder('franchisee admin email').press('Tab');
//   await page.getByRole('button', { name: 'Create' }).click();



//   //await expect(page.getByText('Mama Ricci\'s kitchen', { exact: true })).toBeVisible();
//   //await expect(page.getByRole('cell', { name: 'new franch' })).toBeVisible();
//  });



//  test('create a new franchise and then delete it', async ({ page }) => {
//   var firstCall = true;

//   await page.route('*/**/api/auth', async (route) => {
//     const loginReq = { email: 'a@jwt.com', password: 'admin' };
//     const loginRes = { user: { id: 1, name: '常用名字', email: 'a@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
//     expect(route.request().method()).toBe('PUT');
//     expect(route.request().postDataJSON()).toMatchObject(loginReq);
//     await route.fulfill({ json: loginRes });
//   });

//   await page.route('*/**/api/franchise', async (route) => {

//     if (route.request().method() == 'POST') {
//       const franchReq = {"name": "new franch", "admins": [{"email": "a@jwt.com"}]};
//       const franchRes = {
//         "name": "new franch",
//         "admins": [
//           {
//             "email": "a@jwt.com",
//             "id": 1,
//             "name": "常用名字"
//           }
//         ],
//         "id": 1}

//       expect(route.request().method()).toBe('POST');
//       expect(route.request().postDataJSON()).toMatchObject(franchReq);
//       await route.fulfill({ json: franchRes });
//     }
//     else { //GET request
//       if (Boolean(firstCall)) {
//         firstCall = false;
//         const getResp = []

//         expect(route.request().method()).toBe('GET');
//         await route.fulfill({ json: getResp });

//       }
//       else {//the second call
//         const getResp = [
//           {
//             "id": 1,
//             "name": "new franch",
//             "stores" : []
//           }
//         ]

//         expect(route.request().method()).toBe('GET');
//         await route.fulfill({ json: getResp });
//       }
//     }
//   });

//   await page.route('*/**/api/franchise/franchiseID', async (route) => {
//     const deleteRes = {
//       "message": "franchise deleted"
//     }
//     expect(route.request().method()).toBe('DELETE');
//     await route.fulfill({ json: deleteRes });
//   });


//   await page.goto('http://localhost:5173/admin-dashboard');
//   //await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();

//   // await page.getByRole('link', { name: 'Login' }).click();
//   // await page.getByPlaceholder('Email address').fill('a@jwt.com');
//   // await page.getByPlaceholder('Email address').press('Tab');
//   // await page.getByPlaceholder('Password').fill('admin');
//   // await page.getByRole('button', { name: 'Login' }).click();

//   // await page.getByLabel('Global').getByRole('link', { name: 'Admin' }).click();
//   // await expect(page.getByText('Mama Ricci\'s kitchen', { exact: true })).toBeVisible();

//   // await page.getByRole('button', { name: 'Add Franchise' }).click();
//   // await expect(page.getByText('Create franchise', { exact: true })).toBeVisible();

//   await page.getByPlaceholder('franchise name').fill('new franch');
//   await page.getByPlaceholder('franchise name').press('Tab');
//   await page.getByPlaceholder('franchisee admin email').fill('a@jwt.com');
//   await page.getByPlaceholder('franchisee admin email').press('Tab');
//   await page.getByRole('button', { name: 'Create' }).click();

//   await expect(page.getByText('Mama Ricci\'s kitchen', { exact: true })).toBeVisible();

//   await page.getByRole('row', { name: 'new franch 常用名字 Close' }).getByRole('button').click();
//   await expect(page.getByText('Sorry to see you go')).toBeVisible();
  
//  // await page.getByRole('button', { name: 'Close' }).click();
//   //await expect(page.locator('#root div').filter({ hasText: 'Keep the dough rolling and' }).nth(3)).toBeVisible();

  
//   // await expect(page.getByRole('cell', { name: 'anotherFranch' })).toBeVisible();
//   // await expect(page.getByRole('cell', { name: '常用名字' }).first()).toBeVisible();
//   // await page.getByRole('row', { name: 'anotherFranch 常用名字 Close' }).getByRole('button').click();
//   // await expect(page.getByText('Sorry to see you go')).toBeVisible();
//   // await page.getByRole('button', { name: 'Close' }).click();
//   // await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();

//  });



 //passes!
 test('login and then logout', async ({ page }) => {
  
  await page.route('*/**/api/auth', async (route) => {
    if (route.request().method() == 'PUT') {
      const loginReq = { email: 'd@jwt.com', password: 'a' };
      const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
      expect(route.request().method()).toBe('PUT');
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    }
    else {
      const logoutRes = { message: 'logout successful'};
      expect(route.request().method()).toBe('DELETE');
      await route.fulfill({ json: logoutRes });
    }
  });

  await page.goto('http://localhost:5173/');
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
});


















  

