const Encounter = require('./../models/encounterModel');

exports.getAllEncounters = async (req, res)=>{
    try{
        const encounters = await Encounter.find();
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