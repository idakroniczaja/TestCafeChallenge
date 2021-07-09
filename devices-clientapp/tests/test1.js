import {Selector, ClientFunction, t} from "testcafe"
const getLocation = ClientFunction(() => document.location.href);

fixture `Testing device page`
.page('http://localhost:3000/')

//TEST 1
test('Retrieve list of devices', async t => {

    //if all elements are visible in DOM
    await t.expect(Selector('.list-devices').child().visible).ok();

    //checking name, type and capacity of each element is correctly displayed
     await t.expect(Selector('.list-devices').child().find('.device-name').exists).ok()
     await t.expect(Selector('.list-devices').child().find('.device-type').exists).ok()
     await t.expect(Selector('.list-devices').child().find('.device-capacity').exists).ok()
     

///checking if the buttons exist
   await t.expect(Selector('.list-devices').child('.device-main-box').child('.device-options').child('.device-edit').exists).ok();
   await t.expect(Selector('.list-devices').child('.device-main-box').child('.device-options').child('.device-remove').exists).ok();
});    

///TEST 2
test('Create new device', async t => {
    ///if clicking on the button leads to /add page
  
    await t.click(Selector('.submitButton'))
    await t.expect(getLocation()).contains('/add')

  ///getting valies from input
    await t.typeText('#system_name','New device')
    await t.expect(Selector('#system_name').value).eql('New device')


///getting values from select options for type
    await t
    .click(Selector('#type'))
    .click(Selector('#type').find('option').withText('WINDOWS WORKSTATION'))
    .expect(Selector('#type').value).eql('WINDOWS_WORKSTATION');

 ///getting valies from input
    await t.typeText('#hdd_capacity','50')
    await t.expect(Selector('#hdd_capacity').value).eql('50')

    ////clicking save should lead back to all devices list
    await t.click(Selector('.submitButton'))
    await t.expect(getLocation()).contains('/')

    /////checking if the list containts new device
    await t.expect(Selector('.device-name').withText('New device').exists).ok();


    ///checking if name, type and capacity are visible
    let newDeviceName = Selector('.list-devices').child('.device-main-box').child('.device-info').find('.device-name').withText('New device')
    let newDeviceType = Selector('.list-devices').child('.device-main-box').child('.device-info').find('.device-type').withText('WINDOWS WORKSTATION')
    let newDeviceCapacity = Selector('.list-devices').child('.device-main-box').child('.device-info').find('.device-capacity').withText('50 GB')


    await t.expect(newDeviceName.visible).ok();
    await t.expect(newDeviceType.visible).ok();
    await t.expect(newDeviceCapacity.visible).ok();
});    



////TEST 3
test('Rename device', async t => {
    ///if clicking on the button of first elem leads to /edit page
    let firstElement = Selector('.list-devices').nth(0).find('.device-edit');
    await t.click(firstElement)
    await t.expect(getLocation()).contains('/edit')
    
    ///deleting old name and getting valies from input with new name
     await t
     .selectText('#system_name')
     .pressKey('delete')
     .typeText('#system_name','Renamed Device')
     .expect(Selector('#system_name').value).eql('Renamed Device')

  ////clicking update should lead back to all devices list
  await t.click(Selector('.submitButton'))
  await t.expect(getLocation()).eql('http://localhost:3000/')

/////checking if the list containts renamed device
      await t.expect(Selector('.device-name').withText('Renamed Device').exists).ok();


});    


////TEST 3
test('Delete device', async t => {

////getting the name of the last element before deleting it so we can use it for checking ig it exists after deleting
let lastElementName = Selector('.device-main-box').nth(-1).find('.device-name')
const lastElementNameText = await lastElementName()
let name = Selector('.device-name').withText(lastElementNameText.textContent)
console.log(lastElementNameText.textContent)


///if clicking on delete button of last element and we should be on the same page
    let lastElement = Selector('.device-main-box').nth(-1).find('.device-remove');
    await t.click(lastElement)
     await t.expect(getLocation()).eql('http://localhost:3000/')

///to reload the page
await t.eval(() => location.reload(true));


/////checking if the list containts deleted device
await t.expect(name.exists).notOk()


});    

