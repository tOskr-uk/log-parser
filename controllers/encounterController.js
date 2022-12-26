const Encounter = require('./../models/encounterModel');

exports.getAllEncounters = async (req, res)=>{
    try{
        // BUILD QUERY
        // ---------------
        // 1) FILTERING
        // ---------------
        // creates the queryObj
        const queryObj = {...req.query} // destructuring the req.query
        // console.log(req.query); // ref: shows query object
        // console.log(queryObj);

        // removes excluded query fields from queryObj 
        const excludedFields = ['page', 'sort', 'limit', 'fields'];   // list query fields to be excluded
        excludedFields.forEach(el=>{
            delete queryObj[el]
        })
        
        // convert to string to add the '$' symbol to the [gte], [gt], [lte], [lt] operators
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>{
            `$${match}`
        })

        // convery back to object and pass to query 
        let query = Encounter.find(JSON.parse(queryStr));
        

        // ---------------
        // 2) SORTING
        // ---------------
        // Check for 'sort' in the query string, set defualt if not present and add to query.
        if(req.query.sort){
            // remove comas and replace with spaces
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
        } else {
            // default sort
            query = query.sort('-start')
        }


        // ------------------
        // 3) FIELD LIMITING
        // ------------------
        // Check for 'fields' in the query string, set defualt if not present and add to query.
        if(req.query.sort){
            // remove comas and replace with spaces
            const sortBy = req.query.fields.split(',').join(' ');
            query = query.select(fields)
        } else {
            // default sort
            query = query.select('-__v') // removes the mongoose property added to every document from the query
        }


        // EXECUTE QUERY 
        const encounters = await query;

        // const encounters = await Encounter.find();
        // SEND RESPONSE
        res.status(200).json({
            status: 'Success',
            results: encounters.length,
            data: {
                encounters
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getEncounter = async (req, res)=>{
    try{
        const encounter = await Encounter.findById(req.params.id)
        res.status(200).json({
            status: 'Success',
            data: {
                encounter
            }
        });
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.deleteEncounter = async (req, res)=>{
    try{
        const encounter = await Encounter.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}