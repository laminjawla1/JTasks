package com.jgroup.jtasks.authorization.privileges;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PrivilegeService {

    private final PrivilegeRepository privilegeRepository;

    @Transactional(readOnly = true)
    public List<PrivilegeResponse> getPrivileges() {
        return privilegeRepository.findAll().stream().map(Privilege::response).toList();
    }

}
