const Weather = require('../models/weather.model.js');

const axios = require("axios")

const area = require('../area.json');

let getInfo = async (lat,lon) => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${process.env.API_KEY}`)
    return response.data;
}

exports.showAll = async (req, res) => {
    let data = [];

    for(coordinate in area) {
        let lat = area[coordinate].latitude;
        let lon = area[coordinate].longitude;

        let values = await getInfo(lat,lon);

        const requirements = {
            "latitude": values.lat,
            "lon":values.lon,
            "id":values.current.weather[0].id,
            "main":values.current.weather[0].main,
            "description":values.current.weather[0].description
        }

        updateRecord(requirements)

        data.push(requirements);
    }

    res.json(data);
};

exports.showOne = async (req,res) => {
    let latitude = req.params.lat
    let longitude = req.params.lon

    if(latitude === undefined || longitude === undefined)
    {
        res.json({ error:"404 Enter Right Values"})
    }

    if(/^\d+$/.test(latitude)===false || /^\d+$/.test(longitude)===false)
    {
        res.json({ error:"404 Enter Right Values"})
    }

    latitude = parseInt(latitude),
    longitude = parseInt(longitude)


    if((latitude < -90 || latitude > 90) || (longitude < -180 || longitude > 180))
    {
        res.json({ error:"404 Enter Right Values"})
    }

    let values = await getInfo(latitude, longitude);

    const requirements = {
        "latitude": values.lat,
        "longitude":values.lon,
        "id":values.current.weather[0].id,
        "main":values.current.weather[0].main,
        "description":values.current.weather[0].description
    }

    res.json(requirements)
}

function updateRecord(requirements) {

    let status = false;

    Weather.find({ latitude: requirements.latitude, longitude: requirements.longitude }, function(err, datas)
    {
        if (!err)
        {
            if(datas.length === 0)
            {
                var weather = new Weather();

                weather.id = requirements.id;
                weather.latitude = requirements.latitude;
                weather.longitude = requirements.longitude;
                weather.main = requirements.main;
                weather.description = requirements.description;
                weather.save((err, doc) => {
                    if (!err)
                    {
                        console.log("Data Inserted in Database")
                    }
                });
            }
            else
            {
                const data_id = datas[0]._id;

                Weather.findByIdAndUpdate(data_id,requirements, function(err, result){

                    if(err){
                        res.send(err)
                    }
                    else{
                        console.log("Data Updated!");
                    }
                })
            }
        }
    });

    return status;
}