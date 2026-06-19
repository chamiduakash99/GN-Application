package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ComplaintDao extends JpaRepository<Complaint, Integer> {

    @Query("select c from Complaint c where c.id = :id")
    Complaint findByMyId(@Param("id") Integer id);

    @Query("SELECT NEW Complaint(c.id, c.subject) FROM Complaint c")
    List<Complaint> findAllNameId();

    @Query("SELECT c.complaintstatus.name, COUNT(c) " +
            "FROM Complaint c " +
            "GROUP BY c.complaintstatus.name")
    List<Object[]> getStatusSummary();
}