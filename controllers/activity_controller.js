const Activity=require('../models/activity');
const MainHelper=require('../helpers/main_helper');
const ActivityValidator=require('../validators/activity_validator');

class ActivityController {
    static async create(req,res) {
        // check validation of request body
        let validator = new ActivityValidator(req);
        if (validator.fails()) {
            return MainHelper.validationResponse(res, validator.errors().all());
        }
        let validated = validator.validated;
        let {words} = req.body;
        if(words!= null && words!= undefined && words.length > 0) {
            validated.words=words
        }
        
        let name = validated.name;
        name = name.toString().trim().toLowerCase();
        validated.name = name;

        try {
            // count no of activity in the db
            let serialNo = await Activity.countDocuments();
            validated.serialNo = serialNo;

            let activity = await Activity.find({userId:validated.userId,name:validated.name});

            if (activity != null && activity != undefined && activity.length > 0) {
                return MainHelper.response422(res,
                "Activity with this name  already Exist!",
                {
                    name: ["Activity with this name  already Exist!"]
                })
            } else {
                // create new activity
                let response = await Activity.create(validated);
                if (response) {
                    console.log('ACTIVITY ADDED') // necessary
                    return MainHelper.response200(res, 'Activity Added', response.toObject());
                } else {
                    return MainHelper.response404(res);
                }
            }
        } catch (e) {
			console.log(e);
			return MainHelper.response500(res);
		}
    }

    static async list(req, res) {
        try {
            let userId = req.params.id;
            if (!MainHelper.isValidMongoId(userId)) {
                return MainHelper.response400(res);
            }
            // get core folder list
            let tempActivityList = await Activity.find({serialNo:{$lte:3}});
            let response = await Activity.find({userId:userId});
            if(tempActivityList != undefined && tempActivityList != null && tempActivityList.length > 0){
                response.unshift(...tempActivityList)
            }
			let activityList = response.map((activity) => {
				return activity.toObject();
			});
			return MainHelper.response200(res, 'Activity List', activityList);
		} catch (error) {
			console.log(error);
			return MainHelper.response500(res);
		}

    }

    static async get(req, res){
        try {
            let activityId = req.params.id;
            let activity = await Activity.findById(activityId);
            return MainHelper.response200(res, 'Activity', activity.toObject());
        } catch (error) {
            console.log(error);
            return MainHelper.response500(res);
        }
    }

    static async update(req,res){
        
        let activityId=req.params.id;
        if (!MainHelper.isValidMongoId(activityId)) {
            return MainHelper.response400(res);
        }

        let validator = new ActivityValidator(req);
        if (validator.fails()) {
            return MainHelper.validationResponse(res, validator.errors().all());
        }

        let validated = validator.validated;
         
        let {words} = req.body;
        if(words != null && words != undefined && words.length > 0){
            validated.words = words
        }
        
        try {
            let response=await Activity.findOneAndUpdate(
                {_id:activityId},
                validated,
                {new:true}
            );
            if (response) {
                return MainHelper.response200(res, 'Activity Updated', response.toObject());
            } else {
                return MainHelper.response404(res);
            }
        } catch(err) {
            console.log(err);
            return MainHelper.response500(res);
        };

    }

    static async delete(req, res) {
        try {
            let activityId = req.params.id;
            if (!MainHelper.isValidMongoId(activityId)) {
                return MainHelper.response400(res);
            }
            let response = await Activity.findOneAndUpdate(
                {_id: activityId},
                {
                    isDeleted: true
                },
                {new: true}
            );
            if (response) {
                console.log('ACTIVITY DELETED') // necessary
                return MainHelper.response200(res, 'Activity Deleted',response.toObject());
            } else {
                return MainHelper.response404(res);
            }
        } catch (e) {
            console.log(e);
            return MainHelper.response500(res);
        }
    }
}

module.exports=ActivityController;