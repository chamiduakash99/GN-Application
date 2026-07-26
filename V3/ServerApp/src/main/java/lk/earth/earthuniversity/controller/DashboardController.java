package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Single controller that aggregates count/summary data for the Home Dashboard.
 * All endpoints are read-only (GET). No existing controllers were modified.
 */
@CrossOrigin
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired private CitizenDao citizenDao;
    @Autowired private HouseholdDao householdDao;
    @Autowired private CertificaterequestDao certificaterequestDao;
    @Autowired private ComplaintDao complaintDao;
    @Autowired private IdcardrequestDao idcardrequestDao;
    @Autowired private TreecuttingrequestDao treecuttingrequestDao;
    @Autowired private CultivationDao cultivationDao;
    @Autowired private VoterregistryDao voterregistryDao;
    @Autowired private LanddetailDao landdetailDao;
    @Autowired private BuildingDao buildingDao;
    @Autowired private AnnouncementDao announcementDao;

    // ── Top summary counts ────────────────────────────────────────────────────
    @GetMapping("/summary")
    public HashMap<String, Object> getSummary() {
        HashMap<String, Object> summary = new HashMap<>();
        summary.put("totalCitizens",       citizenDao.count());
        summary.put("totalHouseholds",     householdDao.count());
        summary.put("totalVoters",         voterregistryDao.count());
        summary.put("totalLands",          landdetailDao.count());
        summary.put("totalBuildings",      buildingDao.count());
        summary.put("totalAnnouncements",  announcementDao.count());
        return summary;
    }

    // ── Certificate Request status breakdown ──────────────────────────────────
    @GetMapping("/certificaterequests/summary")
    public List<HashMap<String, Object>> getCertRequestSummary() {
        List<Object[]> result = certificaterequestDao.getStatusSummary();
        List<HashMap<String, Object>> list = new ArrayList<>();
        for (Object[] row : result) {
            HashMap<String, Object> map = new HashMap<>();
            map.put("status", row[0]);
            map.put("count",  row[1]);
            list.add(map);
        }
        return list;
    }

    // ── Complaint status breakdown ────────────────────────────────────────────
    @GetMapping("/complaints/summary")
    public List<HashMap<String, Object>> getComplaintSummary() {
        List<Object[]> result = complaintDao.getStatusSummary();
        List<HashMap<String, Object>> list = new ArrayList<>();
        for (Object[] row : result) {
            HashMap<String, Object> map = new HashMap<>();
            map.put("status", row[0]);
            map.put("count",  row[1]);
            list.add(map);
        }
        return list;
    }

    // ── ID Card Request status breakdown ──────────────────────────────────────
    @GetMapping("/idcardrequests/summary")
    public List<HashMap<String, Object>> getIdCardSummary() {
        List<Object[]> result = idcardrequestDao.getStatusSummary();
        List<HashMap<String, Object>> list = new ArrayList<>();
        for (Object[] row : result) {
            HashMap<String, Object> map = new HashMap<>();
            map.put("status", row[0]);
            map.put("count",  row[1]);
            list.add(map);
        }
        return list;
    }

    // ── Tree Cutting Request status breakdown ─────────────────────────────────
    @GetMapping("/treecuttingrequests/summary")
    public List<HashMap<String, Object>> getTreeCuttingSummary() {
        List<Object[]> result = treecuttingrequestDao.getStatusSummary();
        List<HashMap<String, Object>> list = new ArrayList<>();
        for (Object[] row : result) {
            HashMap<String, Object> map = new HashMap<>();
            map.put("status", row[0]);
            map.put("count",  row[1]);
            list.add(map);
        }
        return list;
    }

    // ── Cultivation status breakdown ──────────────────────────────────────────
    @GetMapping("/cultivations/summary")
    public List<HashMap<String, Object>> getCultivationSummary() {
        List<Object[]> result = cultivationDao.getStatusSummary();
        List<HashMap<String, Object>> list = new ArrayList<>();
        for (Object[] row : result) {
            HashMap<String, Object> map = new HashMap<>();
            map.put("status", row[0]);
            map.put("count",  row[1]);
            list.add(map);
        }
        return list;
    }
}