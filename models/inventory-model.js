const pool = require("../database/")

async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
      error.status = 500;
      error.message = "Incorrect input, please enter a valid type id"
      throw error;
    }
  }

async function getVehicleById(vehicleId){
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i  
      WHERE i.inv_id = $1`,
      [vehicleId]
    )
    console.log(data.rows)
    return data.rows
  } catch (error) {
    console.error("getVehicleById error " + error)
    error.status = 500;
    error.message = "Incorrect input, please enter a valid vehicle id"
    throw error;
  }
}

module.exports = {getClassifications , getInventoryByClassificationId, getVehicleById}