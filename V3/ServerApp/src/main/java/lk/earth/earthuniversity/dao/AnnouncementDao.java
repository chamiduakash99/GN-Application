package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AnnouncementDao extends JpaRepository<Announcement,Integer> {


    @Query("select a from Announcement a where a.id = :id")
    Announcement findByMyId(@Param("id") Integer id);


    @Query("SELECT NEW Announcement(a.id, a.title) FROM Announcement a")
    List<Announcement> findAllNameId();

}