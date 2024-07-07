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

async function addClassification(newClass){
  try {
    const data = await pool.query(
      `INSERT INTO public.classification(classification_name) VALUES 
      ($1)`,
      [newClass.new_classification]
    )
    return data.rows
  } catch (error) {
    return error.message
  }
}

async function checkExistingClass(new_classification){
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [new_classification])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}


async function deleteInvByClassId(classification_id) {
  try {
    const result = await pool.query(
      "DELETE FROM public.inventory WHERE classification_id = $1",
      [classification_id]
    );
    return result;
  } catch (error) {
    console.error("deleteInvByClassId error " + error);
    throw error;
  }
}

async function deleteClassById(classification_id) {
  try {
    const result = await pool.query(
      "DELETE FROM public.classification WHERE classification_id = $1",
      [classification_id]
    );
    return result;
  } catch (error) {
    console.error("deleteClassById error " + error);
    throw error;
  }
}

async function addInventory( classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color ){
  try {
    const sql =  `INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)VALUES
                  ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`;
    const values = [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color]
    return await pool.query(sql, values)
  } catch (error) {
    console.error("addInventory error " + error);
    throw error;
  }
}

module.exports = {getClassifications , getInventoryByClassificationId, getVehicleById, addClassification, addInventory, checkExistingClass, deleteInvByClassId, deleteClassById}