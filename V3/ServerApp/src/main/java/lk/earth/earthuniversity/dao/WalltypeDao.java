package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Walltype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WalltypeDao extends JpaRepository<Walltype, Integer> {

    Walltype findByName(String name);

}