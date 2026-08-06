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

        // Every one of these fields is nullable - a child has no NIC, and religion /
        // ethnicity / education level can be unset. Dereferencing them without a null
        // check threw an NPE and returned 500 for the whole search.
        if (name != null && !name.trim().isEmpty()) {
            citizenStream = citizenStream.filter(c -> c.getName() != null
                    && c.getName().toLowerCase().contains(name.trim().toLowerCase()));
        }
        if (nic != null && !nic.trim().isEmpty()) {
            citizenStream = citizenStream.filter(c -> c.getNic() != null
                    && c.getNic().toLowerCase().contains(nic.trim().toLowerCase()));
        }
        if (religion != null && !religion.trim().isEmpty()) {
            citizenStream = citizenStream.filter(c -> c.getReligion() != null
                    && c.getReligion().getName() != null
                    && c.getReligion().getName().equalsIgnoreCase(religion.trim()));
        }
        if (ethnicity != null && !ethnicity.trim().isEmpty()) {
            citizenStream = citizenStream.filter(c -> c.getEthnicity() != null
                    && c.getEthnicity().getName() != null
                    && c.getEthnicity().getName().equalsIgnoreCase(ethnicity.trim()));
        }
        if (educationlevel != null && !educationlevel.trim().isEmpty()) {
            citizenStream = citizenStream.filter(c -> c.getEducationlevel() != null
                    && c.getEducationlevel().getName() != null
                    && c.getEducationlevel().getName().equalsIgnoreCase(educationlevel.trim()));
        }


        return citizenStream.collect(Collectors.toList());
    }

    // 3️⃣ Save new Citizen
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> save(@RequestBody Citizen citizen) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        // Rule: under 18 -> Birth Certificate No + guardian required, NIC not required.
        //       18 and over -> NIC required, Birth Certificate No optional.
        boolean adult = isAdult(citizen.getDateofbirth());
        String nic  = citizen.getNic() == null ? "" : citizen.getNic().trim();
        String bcno = citizen.getBirthcetificateno() == null ? "" : citizen.getBirthcetificateno().trim();

        if (!adult && bcno.isEmpty()) {
            errors += "A citizen under 18 must have a Birth Certificate Number.<br>";
        }
        if (!adult && (citizen.getCitizenguardians() == null || citizen.getCitizenguardians().isEmpty())) {
            errors += "A citizen under 18 must be registered with a guardian.<br>";
        }
        if (adult && nic.isEmpty()) {
            errors += "A citizen 18 or over must have a NIC.<br>";
        }

        // @Pattern rejects "" but allows null, so blank optional fields must be nulled
        // before they reach Hibernate or the flush throws ConstraintViolationException.
        citizen.setNic(nic.isEmpty() ? null : nic);
        citizen.setBirthcetificateno(bcno.isEmpty() ? null : bcno);
        if (citizen.getMobileno() != null && citizen.getMobileno().trim().isEmpty()) citizen.setMobileno(null);
        if (citizen.getEmail() != null && citizen.getEmail().trim().isEmpty()) citizen.setEmail(null);

        // Duplicate checks only when a number was actually supplied,
        // otherwise every blank value collides with every other blank value.
        if (!nic.isEmpty() && citizenDao.findByNic(nic) != null) {
            errors += "Existing Citizen NIC already registered.<br>";
        }
        if (!bcno.isEmpty() && citizenDao.findCitizenByBirthcetificateno(bcno) != null) {
            errors += "Existing Birth Certificate Number already registered.<br>";
        }

        if (errors.isEmpty()) {
            if (citizen.getCitizenaidprograms() != null) {
                for (Citizenaidprogram citizenaidprogram : citizen.getCitizenaidprograms()){
                    citizenaidprogram.setCitizen(citizen);
                }
            }
            if (citizen.getCitizenguardians() != null) {
                for (Citizenguardian citizenguardian : citizen.getCitizenguardians()){
                    citizenguardian.setCitizen(citizen);
                }
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
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> update(@RequestBody Citizen citizen) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";
        Citizen existing = citizenDao.findById(citizen.getId()).orElse(null);
        if (existing == null) {
            errors += "No citizen registered with id " + citizen.getId() + "<br>";
        }

        // Same rule as save(): under 18 -> Birth Certificate No, 18+ -> NIC.
        boolean adult = isAdult(citizen.getDateofbirth());
        String nic  = citizen.getNic() == null ? "" : citizen.getNic().trim();
        String bcno = citizen.getBirthcetificateno() == null ? "" : citizen.getBirthcetificateno().trim();

        if (adult && nic.isEmpty()) {
            errors += "A citizen 18 or over must have a NIC.<br>";
        }
        if (!adult && bcno.isEmpty()) {
            errors += "A citizen under 18 must have a Birth Certificate Number.<br>";
        }
        if (!adult && (citizen.getCitizenguardians() == null || citizen.getCitizenguardians().isEmpty())) {
            errors += "A citizen under 18 must be registered with a guardian.<br>";
        }

        citizen.setNic(nic.isEmpty() ? null : nic);
        citizen.setBirthcetificateno(bcno.isEmpty() ? null : bcno);
        if (citizen.getMobileno() != null && citizen.getMobileno().trim().isEmpty()) citizen.setMobileno(null);
        if (citizen.getEmail() != null && citizen.getEmail().trim().isEmpty()) citizen.setEmail(null);

        // Only reject when the number belongs to a DIFFERENT citizen.
        // (The old code demanded the NIC already exist, which made it impossible to correct one.)
        if (!nic.isEmpty()) {
            Citizen existingByNic = citizenDao.findByNic(nic);
            if (existingByNic != null && !Objects.equals(existingByNic.getId(), citizen.getId())) {
                errors += "Duplicate NIC found for another record.<br>";
            }
        }
        if (!bcno.isEmpty()) {
            Citizen existingByCertificate = citizenDao.findCitizenByBirthcetificateno(bcno);
            if (existingByCertificate != null && !Objects.equals(existingByCertificate.getId(), citizen.getId())) {
                errors += "Duplicate Birth Certificate No found for another record.<br>";
            }
        }



        if (errors.isEmpty()) {
            existing.getCitizenaidprograms().clear();
            if (citizen.getCitizenaidprograms() != null) {
                citizen.getCitizenaidprograms().forEach(citizenaidprogram -> {
                    citizenaidprogram.setCitizen(existing);
                    existing.getCitizenaidprograms().add(citizenaidprogram);
                });
            }

            existing.getCitizenguardians().clear();
            if (citizen.getCitizenguardians() != null) {
                citizen.getCitizenguardians().forEach(citizenguardian -> {
                    citizenguardian.setCitizen(existing);
                    existing.getCitizenguardians().add(citizenguardian);
                });
            }
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
    @ResponseStatus(HttpStatus.OK)
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
