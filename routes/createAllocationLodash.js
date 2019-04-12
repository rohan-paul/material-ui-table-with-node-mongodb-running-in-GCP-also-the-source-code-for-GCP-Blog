/* Utility function (createAllocationExports) to create a top-level field (named 'department_objectId') from a field from the nested Department-object (i.e. from the referenced Department schema).
When I send a data back to client (front-end), it should give me the item's Department name ('department_name' filed) as a top-level field to the schema instead of this being fetched from the nested object. (See I have "department_name": "Gold", as a top-level field that has been created in my backend routes file). The key requirement is, for the referenced Model (Department), I am passing only the ObjectId for the field 'department_objectId' with req.body but in the returned data, I will need the field 'department_name' as a separate top level field with data populated from the referenced Model 'Department'

The reason I need this variable as a top-level field rather than as a nested object, is because of the sort functionality of Material-UI table. While I was able to render the table rows properly by fetching this value from the nested returned object. But the sort functionality's various util functions were becoming too uncontrollable without a top-level field value.
*/

module.exports = {
  createAllocationEmployee: item => ({
    _id: item._id,
    department_objectId:
      item.department_objectId && item.department_objectId._id,
    employee_name: item.employee_name,
    work_description: item.work_description,
    avg_employee_productivity: item.avg_employee_productivity,
    benchmark_employee_productivity: item.benchmark_employee_productivity,
    date: item.date,
    department_name: item.department_objectId && item.department_objectId.name
  })
};
