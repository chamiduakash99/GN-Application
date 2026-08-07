package lk.earth.earthuniversity.controller;
import lk.earth.earthuniversity.dao.EmployeeDao;
import lk.earth.earthuniversity.entity.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.stream.Collectors;

import java.util.List;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/employees")
public class EmployeeController {

    @Autowired
    private EmployeeDao employeedao;

    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('employee-select')")
    public List<Employee> get(@RequestParam HashMap<String, String> params) {

        List<Employee> employees = this.employeedao.findAll();

        if(params.isEmpty())  return employees;

        String number = params.get("number");
        String genderid= params.get("genderid");
        String fullname= params.get("fullname");
        String designationid= params.get("designationid");
        String nic= params.get("nic");

        Stream<Employee> estream = employees.stream();

        if(designationid!=null) estream = estream.filter(e -> e.getDesignation().getId()==Integer.parseInt(designationid));
        if(genderid!=null) estream = estream.filter(e -> e.getGender().getId()==Integer.parseInt(genderid));
        if(number!=null) estream = estream.filter(e -> e.getNumber() != null && e.getNumber().equals(number));
        if(nic!=null) estream = estream.filter(e -> e.getNic() != null && e.getNic().contains(nic));
        if(fullname!=null) estream = estream.filter(e -> e.getFullname() != null && e.getFullname().contains(fullname));

        return estream.collect(Collectors.toList());

    }

    @GetMapping(path ="/list",produces = "application/json")
    public List<Employee> get() {

        List<Employee> employees = this.employeedao.findAllNameId();

        employees = employees.stream().map(
                employee -> {
                    Employee e = new Employee(employee.getId(), employee.getCallingname());
                    return  e;
                }
        ).collect(Collectors.toList());

        return employees;

    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Insert')")
    public HashMap<String,String> add(@RequestBody Employee employee){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        if(employeedao.findByNumber(employee.getNumber())!=null)
            errors = errors+"<br> Existing Number";
        if(employeedao.findByNic(employee.getNic())!=null)
            errors = errors+"<br> Existing NIC";


        if(errors=="")
        employeedao.save(employee);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(employee.getId()));
        responce.put("url","/employees/"+employee.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
//    @PreAuthorize("hasAuthority('Employee-Update')")
    public HashMap<String,String> update(@RequestBody Employee employee){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Employee emp1 = employeedao.findByNumber(employee.getNumber());
        Employee emp2 = employeedao.findByNic(employee.getNic());

        if(emp1!=null && !java.util.Objects.equals(employee.getId(), emp1.getId()))
            errors = errors+"<br> Existing Number";
        if(emp2!=null && !java.util.Objects.equals(employee.getId(), emp2.getId()))
            errors = errors+"<br> Existing NIC";
//        if (employee.getDobirth() != null) {
//            java.time.LocalDate dob = new java.sql.Date(employee.getDobirth().getTime()).toLocalDate();
//            if (dob.plusYears(18).isAfter(java.time.LocalDate.now()))
//                errors += "<br> Employee must be at least 18 years old";
//        }


        if(errors=="") employeedao.save(employee);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(employee.getId()));
        responce.put("url","/employees/"+employee.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Employee emp1 = employeedao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Employee Does Not Existed";

        if(errors=="") employeedao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/employees/"+id);
        responce.put("errors",errors);

        return responce;
    }

}




