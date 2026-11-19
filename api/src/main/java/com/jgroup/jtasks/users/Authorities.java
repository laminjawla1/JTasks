package com.jgroup.jtasks.users;

import java.util.Set;

public record Authorities(Set<String> roles, Set<String> privileges) {
}
