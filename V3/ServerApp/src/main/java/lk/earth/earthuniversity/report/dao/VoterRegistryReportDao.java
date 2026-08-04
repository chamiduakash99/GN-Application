package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Voterregistry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VoterRegistryReportDao extends JpaRepository<Voterregistry, Integer> {

    @Query(value = "SELECT v.id AS voterId, " +
            "TIMESTAMPDIFF(YEAR, c.dateofbirth, CURDATE()) AS age " +
            "FROM voterregistry v " +
            "JOIN citizen c ON c.id = v.citizen_id " +
            "WHERE c.dateofbirth IS NOT NULL",
            nativeQuery = true)
    List<Object[]> getVoterAges();
}