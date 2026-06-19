package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.CitizenDao;
import lk.earth.earthuniversity.entity.Citizen;
import lk.earth.earthuniversity.entity.Citizenaidprogram;
import lk.earth.earthuniversity.entity.Citizenguardian;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.time.Period;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/citizens")
public class CitizenController {

    @Autowired
    private CitizenDao citizenDao;

    // 1️⃣ Get all citizens (simple list)
    @GetMapping(path = "/list", produces = "application/json")
    public List<Citizen> getAll() {
        return citizenDao.findAll();
    }

    // 2️⃣ Get with filters (View All and View Selected)
    @GetMapping(produces = "application/json")
    public List<Citizen> get(@RequestParam HashMap<String, String> param) {
        List<Citizen> citizens = citizenDao.findAll();

        if (param.isEmpty()) return citizens;

        String name = param.get("name");
        String nic = param.get("nic");
        String religion = param.get("religion");
        String ethnicity = param.get("ethnicity");
        String educationlevel = param.get("educationlevel");


        Stream<Citizen> citizenStream = citizens.stream();

        if (name != null) {
            citizenStream = citizenStream.filter(c -> c.getName().toLowerCase().contains(name.toLowerCase()));
        }
        if (nic != null) {
            citizenStream = citizenStream.filter(c -> c.getNic().equalsIgnoreCase(nic));
        }
        if (religion != null) {
            citizenStream = citizenStream.filter(c -> c.getReligion().getName().equals(religion));
        }
        if (ethnicity != null) {
            citizenStream = citizenStream.filter(c -> c.getEthnicity().getName().equals(ethnicity));
        }
        if (educationlevel != null) {
            citizenStream = citizenStream.filter(c -> c.getEducationlevel().getName().equals(educationlevel));
        }


        return citizenStream.collect(Collectors.toList());
    }

    // 3️⃣ Save new Citizen
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> save(@RequestBody Citizen citizen) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (!isAdult(citizen.getDateofbirth()) && citizen.getBirthcetificateno() == null){
            errors += "This child must  have a Birth Certificate Number !.<br>";

        }
        if (!isAdult(citizen.getDateofbirth()) && citizen.getCitizenguardians() == null){
            errors += "This child must be register with a guardian.<br>";

        }
        if (isAdult(citizen.getDateofbirth()) && Objects.equals(citizen.getNic(), "")){
            errors += "Adults must have a NIC.<br>";

        }
        Citizen existingByNic = citizenDao.findByNic(citizen.getNic());

        if (existingByNic != null) {
            errors += "Existing Citizen NIC already registered.<br>";
        }

        if (errors.isEmpty()) {
            for (Citizenaidprogram citizenaidprogram : citizen.getCitizenaidprograms()){
                citizenaidprogram.setCitizen(citizen);
                System.out.println("Success 1");
            }
            for (Citizenguardian citizenguardian : citizen.getCitizenguardians()){
                citizenguardian.setCitizen(citizen);
                System.out.println("Success 2");

            }
            citizenDao.save(citizen);
        } else {
            errors = "Server Validation Errors:<br>" + errors;
        }

        response.put("ItemCode", citizen.getNic());
        response.put("url", "/citizens/post");
        response.put("errors", errors);

        return response;
    }

    // 4️⃣ Update existing Citizen
    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Citizen citizen) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";
        Citizen existing = citizenDao.findById(citizen.getId()).get();
        if (Objects.equals(existing,null)){
            errors += "NO citizen registered with " +  citizen.getId() + "<br>";
        }
        Citizen existingByNic = null;
        if (isAdult(citizen.getDateofbirth())){
             existingByNic = citizenDao.findByNic(citizen.getNic());
        }

        if (isAdult(citizen.getDateofbirth()) && existingByNic == null) {
            errors += "No record found with NIC " + citizen.getNic() + "<br>";
        }

        if (existingByNic != null && !Objects.equals(existingByNic.getId(), citizen.getId())) {
            errors += "Duplicate NIC found for another record.<br>";
        }

        Citizen existingByCertificate = null;
        if (!isAdult(citizen.getDateofbirth())){
            existingByCertificate = citizenDao.findCitizenByBirthcetificateno(citizen.getBirthcetificateno());
        }

        if (!isAdult(citizen.getDateofbirth()) && existingByCertificate == null) {
            errors += "No record found with Birth Certificate No " + citizen.getNic() + "<br>";
        }

        if (existingByCertificate != null && !Objects.equals(existingByCertificate.getId(), citizen.getId())) {
            errors += "Duplicate Birth Certificate No found for another record.<br>";
        }



        if (errors.isEmpty()) {
            existing.getCitizenaidprograms().clear();
            citizen.getCitizenaidprograms().forEach(citizenaidprogram -> {
                citizenaidprogram.setCitizen(citizen);
                existing.getCitizenaidprograms().add(citizenaidprogram);
                citizenaidprogram.setCitizen(citizen);

            });

            existing.getCitizenguardians().clear();
            citizen.getCitizenguardians().forEach(citizenguardian -> {
                citizenguardian.setCitizen(citizen);
                existing.getCitizenguardians().add(citizenguardian);
                citizenguardian.setCitizen(citizen);
            });
            BeanUtils.copyProperties(citizen,existing,"id","citizenaidprograms","citizenguardians");
            citizenDao.save(existing);
        } else {
            errors = "Server Validation Errors:<br>" + errors;
        }

        response.put("ItemCode", citizen.getNic());
        response.put("url", "/citizens/put");
        response.put("errors", errors);

        return response;
    }

    // 5️⃣ Delete Citizen
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Optional<Citizen> citizen = citizenDao.findById(id);
        if (citizen.isPresent()) {
            citizenDao.delete(citizen.get());
        } else {
            errors = "Server Validation Errors:<br>No existing citizen found.";
        }

        response.put("url", "/citizens/delete");
        response.put("errors", errors);

        return response;
    }

    public static boolean isAdult(Date dateofbirth) {

        if (dateofbirth == null) return false;

        LocalDate dob = dateofbirth.toLocalDate();
        LocalDate today = LocalDate.now();

        if (dob.isAfter(today)) return false;

        int age = Period.between(dob, today).getYears();

        return age >= 18;
    }
}
