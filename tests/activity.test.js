const db = require('../engine/db');
const { use } = require("../routes/user_apis");
const mongoose = require('mongoose');
const Activity = require('../models/activity');
const User = require('../models/user');
const ActivityController = require('../controllers/activity_controller');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (paramsValues,body) => ({
    params:paramsValues,
    body
});

const mockRequestForUser = (userIp, body) => ({
    connection: { remoteAddress: userIp },
    body,
  });

beforeAll(async() => {
    try {
        let newUser = {
            method: 'local',
            local: {
                email: 'unittest1@email.com',
                password: "password"
            }
        }
        await User.create(newUser)
    } catch(error) {
        console.log("Error creating test user");
    }

})

describe('Activity Tests',() => {
    it('Add Activity : User id not found',async() => {
        // given
        const resl = mockResponse();
        const reql = mockRequest(
            {},
            {
                "name":"unittest1"
            }
        );
        
        // when
        await ActivityController.create(reql,resl);
        expect(resl.status).toHaveBeenCalledWith(422);
        expect(resl.json).toHaveBeenCalledWith({
            "message": "Validation error!",
            "data": {
                "userId": [
                    "The userId field is required."
                ]
            }
        });
    })

    it('Add Activity : Activity Shoud be added',async()=>{
        // given
        const user=await User.findOne({'local.email': "unittest1@email.com"})
        const consoleSpy = jest.spyOn(console, 'log');
        const resl = mockResponse();
        const reql = mockRequest(
            {},
            {
                "userId":user.id,
                "name":"unittest1"
            }
        );
        
        // when
        await ActivityController.create(reql,resl);
        expect(resl.status).toHaveBeenCalledWith(200);
        expect(console.log).toHaveBeenCalledWith("ACTIVITY ADDED");
        expect(resl.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "data":  expect.objectContaining({
                        "id": expect.any(Object),
                        "userId":expect.any(Object),
                        "name":"unittest1",
                        "isDeleted":false,
                        "serialNo":expect.any(Number),
                    })
            })
        )
    })

    it('Add Activity: Activity Should Already be in use',async() => {
        const user = await User.findOne({'local.email': "unittest1@email.com"})
        const activity = await Activity.findOne({'name': "unittest1"});
        // given
        const resl = mockResponse();
        const reql = mockRequest(
            {},
            {
                "userId":user.id,
                "name":activity.name,
            }
        );
        
        // when
        await ActivityController.create(reql,resl);
        // then
        expect(resl.status).toHaveBeenCalledWith(422);
        expect(resl.json).toHaveBeenCalledWith({
            message: "Activity with this name  already Exist!",
            errors: {name: ["Activity with this name  already Exist!"]}
        });
    })

    it('Get Activities List : Getting List of Activity Details',async() => {
        // given
        const user=await User.findOne({'local.email': "unittest1@email.com"})
        const resl = mockResponse();
        const reql = mockRequest(
            {
                id:user.id
            },
            {}
        );
        
        // when
        await ActivityController.list(reql,resl);

        // then
        expect(resl.status).toHaveBeenCalledWith(200);
        expect(resl.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "data": expect.arrayContaining([
                     expect.objectContaining({
                        "id": expect.any(Object),
                        "userId":expect.any(Object),
                        "name":"unittest1",
                        "isDeleted":false,
                        "serialNo":expect.any(Number),
                     })
                ])
             })
         )
    })

    it('Get Activity: Getting Activity Details',async() => {
        const activity = await Activity.findOne({'name': "unittest1"});
        const resl = mockResponse();
        const reql = mockRequest(
            {
                id:activity.id
            },
            {}
        );

        // when
        await ActivityController.get(reql,resl);

        // then
        expect(resl.status).toHaveBeenCalledWith(200);
        expect(resl.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "data":  expect.objectContaining({
                        "id": expect.any(Object),
                        "userId":expect.any(Object),
                        "name":"unittest1",
                        "isDeleted":false,
                        "serialNo":expect.any(Number),
                    })
            })
        )
    })


    it('Update Activity : Activity Should be updated', async() => {
        const user=await User.findOne({'local.email': "unittest1@email.com"})
        const activity = await Activity.findOne({'name': "unittest1"});

        const resl = mockResponse();
        const reql = mockRequest(
            {
                id:activity.id
            },
            {
                "userId":user.id,
                "name":'unittest2',                
            }
        );

        // when
        await ActivityController.update(reql,resl);
        
        // then
        expect(resl.status).toHaveBeenCalledWith(200);
        expect(resl.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "data":  expect.objectContaining({
                        "id": expect.any(Object),
                        "userId":expect.any(Object),
                        "isDeleted":false,
                        "serialNo":expect.any(Number),
                    })
            })
        )
    })

    it('Delete Activity: Activity Should be deleted', async() => {
        const activity = await Activity.findOne({'name': "unittest2"});
        // given
        const consoleSpy = jest.spyOn(console, 'log');
        const resl = mockResponse();
        const reql = mockRequest(
            {
                id:activity.id
            },
            {}
        );
        
        // when
        await ActivityController.delete(reql,resl);

        // then
        expect(resl.status).toHaveBeenCalledWith(200);
        expect(console.log).toHaveBeenCalledWith("ACTIVITY DELETED");
        expect(resl.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "data":  expect.objectContaining({
                        "id": expect.any(Object),
                        "userId":expect.any(Object),
                        "name":"unittest2",
                        "isDeleted":true,
                        "serialNo":expect.any(Number),
                    })
            })
        )
    })
})

afterAll(async () => {
    await User.findOneAndDelete({'local.email': "unittest1@email.com"})
    await Activity.findOneAndDelete({'name': "unittest1"})
    await Activity.findOneAndDelete({'name': "unittest2"})
    await mongoose.disconnect()
});