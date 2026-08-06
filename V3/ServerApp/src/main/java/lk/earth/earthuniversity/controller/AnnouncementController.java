package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.AnnouncementDao;
import lk.earth.earthuniversity.entity.Announcement;
import lk.earth.earthuniversity.entity.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import lk.earth.earthuniversity.dao.UserDao;
import lk.earth.earthuniversity.entity.User;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementDao announcementDao;

    @Autowired
    private UserDao userDao;

    // 1) VIEW LIST (SIMPLE)
    /**
     * Anything whose expiry date has passed is switched to inactive before the list
     * is returned, so an expired notice never shows as active.
     */
    private List<Announcement> deactivateExpired(List<Announcement> list) {
        java.sql.Timestamp now = new java.sql.Timestamp(System.currentTimeMillis());
        List<Announcement> changed = new java.util.ArrayList<>();
        for (Announcement a : list) {
            if (a.getExpiredat() != null && a.getExpiredat().before(now)
                    && a.getIsactive() != null && a.getIsactive() != 0) {
                a.setIsactive((byte) 0);
                changed.add(a);
            }
        }
        if (!changed.isEmpty()) announcementDao.saveAll(changed);
        return list;
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Announcement> getList() {
        return deactivateExpired(announcementDao.findAll());
    }

    // 2) VIEW ALL + FILTER
    @GetMapping(produces = "application/json")
    public List<Announcement> get(@RequestParam HashMap<String, String> params) {

        List<Announcement> announcements = deactivateExpired(announcementDao.findAll());

        if (params.isEmpty()) return announcements;

        String title = params.get("title");
        String isactive = params.get("isactive");

        Stream<Announcement> stream = announcements.stream();

        if (title != null) {
            stream = stream.filter(a ->
                    a.getTitle() != null &&
                            a.getTitle().equalsIgnoreCase(title)
            );
        }

        if (isactive != null) {
            stream = stream.filter(a ->
                    a.getIsactive() != null &&
                            a.getIsactive().toString().equals(isactive)
            );
        }

        return stream.collect(Collectors.toList());
    }


    // 3) SAVE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> save(@RequestBody Announcement announcement) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (announcement.getTitle() == null || announcement.getTitle().isEmpty()) {
            errors = errors + "Title is required <br>";
        }

        if (errors.equals("")) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            String username = auth.getName();

            if (username == null || username.equals("anonymousUser")) {
                errors = "User not authenticated";
            } else {

                User user = userDao.findByUsername(username);

                if (user == null || user.getEmployee() == null) {
                    errors = "Employee not linked to logged user";
                } else {

                    Employee employee = user.getEmployee();
                    announcement.setEmployee(employee);

                    announcementDao.save(announcement);
                }
            }

        } else {
            errors = "Server Validation Errors : <br>" + errors;
        }

        response.put("id", String.valueOf(announcement.getId()));
        response.put("url", "/announcements/post");
        response.put("errors", errors);

        return response;
    }



    // 4) UPDATE
    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> update(@RequestBody Announcement announcement) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Optional<Announcement> ext = announcementDao.findById(announcement.getId());

        if (ext.isEmpty()) {
            errors = errors + "Announcement not found <br>";
        }

        if (errors.equals("")) {
            // Fetch fresh from DB using custom query to get employee
            Announcement existing = announcementDao.findByMyId(announcement.getId());
            Employee employee = existing.getEmployee();

            announcement.setEmployee(employee);
            announcementDao.save(announcement);
        } else {
            errors = "Server Validation Errors : <br>" + errors;
        }

        response.put("id", String.valueOf(announcement.getId()));
        response.put("url", "/announcements/put");
        response.put("errors", errors);
        return response;
    }


    // 5) DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Optional<Announcement> announcement = announcementDao.findById(id);

        if (announcement.isEmpty()) {
            errors = "Announcement not found";
        }

        if (errors.equals("")) {
            announcementDao.delete(announcement.get());
        } else {
            errors = "Server Validation Errors : <br>" + errors;
        }

        response.put("url", "/announcements/delete");
        response.put("errors", errors);

        return response;
    }
}