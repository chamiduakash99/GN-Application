package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Streetstatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StreetstatusDao extends JpaRepository<Streetstatus, Integer> {
}
